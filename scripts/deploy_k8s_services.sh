#!/bin/bash

if [ -z "${VERSION}" ];then\
        export VERSION="$(cat package.json | jq -r '.version')-$(git rev-parse --short HEAD)"
fi

export DOCKER_IMAGE=${DOCKER_USERNAME}/${APP_ID}:${VERSION}

if [ -z "${KUBECTL}" ]; then
        if [ ! -f "$(which kubectl > /dev/null)" ]; then
                export KUBECTL=$(pwd)/kubectl
                curl -sLO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" > ${KUBECTL}
                chmod +x ${KUBECTL};
        else
                export export KUBECTL=$(which kubectl)
        fi;
fi

#set up services to start
if [ -z "${APP_DNS}" ]; then
        #assume local kube conf (minikube or k3s)
        K8S_SERVICES="elasticsearch service deployment ingress-local";
        if ! (${KUBECTL} version 2>&1 | grep -q Server); then
                if [ -z "${K8S}" ]; then
                        # prefer k3s for velocity of install and startup in CI
                        export K8S=k3s;
                fi;

                if [ "${K8S}" = "k3s" ]; then
                        if ! (which k3s); then
                                (curl -sfL https://get.k3s.io | sh - 2>&1 |\
                                        awk 'BEGIN{s=0}{printf "\r☸️  Installing k3s (" s++ "/16)"}') && echo -e "\r\033[2K☸️   Installed k3s";
                        fi;
                        mkdir -p ~/.kube;
                        export KUBECONFIG=${HOME}/.kube/config-local-k3s.yaml;
                        sudo cp /etc/rancher/k3s/k3s.yaml ${KUBECONFIG};
                        sudo chown ${USER} ${KUBECONFIG};
                        if ! (sudo k3s ctr images check | grep -q ${DOCKER_IMAGE}); then
                                ./scripts/docker-build.sh;
                                docker save ${DOCKER_IMAGE} --output /tmp/img.tar;
                                (sudo k3s ctr image import /tmp/img.tar > /dev/null 2>&1);
                                echo -e "⤵️   Docker image imported to k3s";
                                rm /tmp/img.tar;
                        fi;
                fi;

                if [ "${K8S}" = "minikube" ]; then
                        minikube start;
                        if ! (minikube image list | grep -q ${DOCKER_IMAGE}); then
                                ./scripts/docker-build.sh;
                                (minikube image load ${DOCKER_IMAGE} > /dev/null 2>&1);
                                echo -e "⤵️   Docker image imported to minikube";
                        fi;
                fi;
        fi;
else
        K8S_SERVICES="elasticsearch service deployment certificate ingressroute loadbalancer-traefik"
fi;

export OS_TYPE=$(cat /etc/os-release | grep -E '^NAME=' | sed 's/^.*debian.*$/DEB/I;s/^.*ubuntu.*$/DEB/I;s/^.*fedora.*$/RPM/I;s/.*centos.*$/RPM/I;')


if [ ! -f "/usr/bin/envsubst" ]; then
        if [ "${OS_TYPE}" = "DEB" ]; then
                apt-get install -yqq gettext;
        fi;
        if [ "${OS_TYPE}" = "RPM" ]; then
                sudo yum install -y gettext;
        fi;
fi;

#install elasticsearch kube controller
(${KUBECTL} get elasticsearch > /dev/null 2>&1 && echo "✓   elasticsearch k8s controller") \
        || ( (${KUBECTL} apply -f https://download.elastic.co/downloads/eck/1.5.0/all-in-one.yaml > /dev/null 2>&1) && echo "🚀  elasticsearch k8s controller")

#create namespace first
RESOURCENAME=$(envsubst < k8s/namespace.yaml | grep -e '^  name:' | sed 's/.*:\s*//;s/\s*//');
if (${KUBECTL} get namespaces --namespace=${APP_GROUP} | grep -v 'No resources' | grep -q ${APP_GROUP}); then
        echo "✓   namespace ${APP_GROUP}";
else
        if (envsubst < k8s/namespace.yaml | ${KUBECTL} apply -f - > /dev/null 2>&1); then
                echo "🚀  namespace ${APP_GROUP}";
        else
                echo -e "\e[31m❌  namespace ${APP_GROUP}" && exit 1;
        fi;
fi;

#create configMap for elasticsearch stopwords
: ${STOPWORDS:=./elastic/config/analysis/stopwords_judilibre.txt}
RESOURCENAME=${APP_GROUP}-stopwords
if (${KUBECTL} get configmap --namespace=${APP_GROUP} 2>&1 | grep -v 'No resources' | grep -q ${RESOURCENAME}); then
        echo "✓   configmap ${APP_GROUP}/${RESOURCENAME}";
else
        if [ -f "$STOPWORDS" ]; then
                if (${KUBECTL} create configmap --namespace=${APP_GROUP} ${RESOURCENAME} --from-file=${STOPWORDS} > /dev/null 2>&1); then
                        echo "🚀  configmap ${APP_GROUP}/${RESOURCENAME}";
                else
                        echo -e "\e[31m❌  configmap ${APP_GROUP}/${RESOURCENAME} !\e[0m" && exit 1;
                fi;
        fi;
fi;

#create common services (tls chain based on traefik hypothesis, web exposed k8s like Scaleway, ovh ...)
for resource in ${K8S_SERVICES}; do
        NAMESPACE=$(envsubst < k8s/${resource}.yaml | grep -e '^  namespace:' | sed 's/.*:\s*//;s/\s*//;');
        RESOURCENAME=$(envsubst < k8s/${resource}.yaml | grep -e '^  name:' | sed 's/.*:\s*//;s/\s*//');
        RESOURCETYPE=$(envsubst < k8s/${resource}.yaml | grep -e '^kind:' | sed 's/.*:\s*//;s/\s*//');
        (${KUBECTL} get ${RESOURCETYPE} --namespace=${NAMESPACE} 2>&1 | grep -v 'No resources' | grep -q ${RESOURCENAME} && echo "✓   ${resource} ${NAMESPACE}/${RESOURCENAME}") || \
        ( (envsubst < k8s/${resource}.yaml | ${KUBECTL} apply -f - > /dev/null) && (echo "🚀  ${resource} ${NAMESPACE}/${RESOURCENAME}") ) \
        || ( echo -e "\e[31m❌  ${resource} ${NAMESPACE}/${RESOURCENAME} !\e[0m" && exit 1);
        if [ "$?" -ne "0" ]; then exit 1;fi;
done;

./scripts/wait_services_readiness.sh || exit 1;

# elasticsearch init
: ${ELASTIC_TEMPLATE:=./elastic/template-medium.json}

if [ -f "${ELASTIC_TEMPLATE}" ];then
        if ! (${KUBECTL} exec --namespace=${APP_GROUP} ${APP_GROUP}-es-default-0 -- curl -s "localhost:9200/_template/t_judilibre" 2>&1 | grep -q ${APP_GROUP}); then
                if (cat ${ELASTIC_TEMPLATE} | ${KUBECTL} exec --namespace=${APP_GROUP} ${APP_GROUP}-es-default-0 -- curl -s -XPUT "localhost:9200/_template/t_judilibre" -H 'Content-Type: application/json' -d "$(</dev/stdin)" > /dev/null 2>&1); then
                        echo "🚀   elasticsearch templates";
                else
                        echo -e "\e[31m❌  elasticsearch templates !\e[0m" && exit 1;
                fi;
        else
                echo "✓   elasticsearch templates";
        fi;
fi;
if ! (${KUBECTL} exec --namespace=${APP_GROUP} ${APP_GROUP}-es-default-0 -- curl -s "localhost:9200/_cat/indices" 2>&1 | grep -q ${ELASTIC_INDEX}); then
        if (${KUBECTL} exec --namespace=${APP_GROUP} ${APP_GROUP}-es-default-0 -- curl -s -XPUT "localhost:9200/${ELASTIC_INDEX}" > /dev/null 2>&1); then
                echo "🚀   elasticsearch default index";
        else
                echo -e "\e[31m❌  elasticsearch default index !\e[0m" && exit 1;
        fi;
else
        echo "✓   elasticsearch default index";
fi;
