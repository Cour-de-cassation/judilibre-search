#!/bin/bash

if [ -z "${VERSION}" ];then\
        export VERSION="$(cat package.json | jq -r '.version')-$(git rev-parse --short HEAD)"
fi

#start network
docker network create judilibre

#start elasticsearch
docker run -d --name elasticsearch --network=judilibre \
        -e xpack.security.enabled=false -e node.store.allow_mmap=false -e bootstrap.memory_lock=true \
        -e "ES_JAVA_OPTS=-Xms${ELASTIC_MEM} -Xmx${ELASTIC_MEM}" -e discovery.type=single-node \
        docker.elastic.co/elasticsearch/elasticsearch:${ELASTIC_VERSION}

# start backend
docker run -d --name ${APP_ID} --network=judilibre -p ${API_PORT}:${API_PORT} -e ELASTIC_NODE=elasticsearch:9200 \
        ${DOCKER_USERNAME}/${APP_ID}:${VERSION}

# wait for backend to be alive
timeout=10 ; ret=1 ;\
until [ "$timeout" -le 0 -o "$ret" -eq "0"  ] ; do\
        (curl -s -XGET http://localhost:${API_PORT}/healthcheck > /dev/null);\
        ret=$? ; \
        if [ "$ret" -ne "0" ] ; then echo -en "\rWait for service ${APP_ID} to start ... $timeout" ; fi ;\
        ((timeout--)); sleep 1 ; \
done ;

#wait for elasticsearch to be alive
timeout=15 ; ret=1 ;\
until [ "$timeout" -le 0 -o "$ret" -eq "0"  ] ; do\
        (docker exec -it elasticsearch curl -s -XGET http://localhost:9200/_cat/indices > /dev/null);\
        ret=$? ; \
        if [ "$ret" -ne "0" ] ; then echo -en "\rWait for elasticsearch to start ... $timeout" ; fi ;\
        ((timeout--)); sleep 1 ; \
done ;
