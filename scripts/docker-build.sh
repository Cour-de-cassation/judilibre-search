#!/bin/bash

# builds Docker image of app if not already built or published
# put it to local kube if minikube or k3s (${K8S} shall be set, then)

if [ -z "${VERSION}" ];then\
        export VERSION="$(cat package.json | jq -r '.version')-$(git rev-parse --short HEAD)"
fi

if [ -z "${APP_ID}" -o -z "${DOCKER_USERNAME}" ]; then
        echo "You must provide all those ENV vars:"
        echo "DOCKER_USERNAME=${DOCKER_USERNAME}"
        echo "APP_ID=${APP_ID}"
        exit 1;
fi;

export DOCKER_IMAGE=${DOCKER_USERNAME}/${APP_ID}:${VERSION}

if ! (docker image inspect ${DOCKER_IMAGE}> /dev/null 2>&1); then
        if (docker pull ${DOCKER_IMAGE} 2> /dev/null); then
                echo "🐋  Docker image pulled";
        else
                (docker build --no-cache --build-arg API_PORT=${API_PORT} --target production -t ${DOCKER_IMAGE} . \
                        | stdbuf -o0 grep Step | stdbuf -o0 sed 's/ :.*//' | awk  '{printf "\033[2K\r🐋  Docker build " $0}');
                echo -e "\033[2K\r🐋  Docker successfully built";
        fi;
fi;
