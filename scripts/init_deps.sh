#!/bin/bash

export DEPS_SRC=$(pwd)/judilibre-admin
export SCRIPTS_SRC=${DEPS_SRC}/scripts
export KUBE_SRC=${DEPS_SRC}/k8s
export ELASTIC_SRC=${DEPS_SRC}/elastic

# clone
if [ ! -d ${SCRIPTS_SRC} ];then
    if ! (git clone https://oauth2:${GIT_TOKEN}@github.com/Cour-de-cassation/judilibre-admin > /dev/null 2>&1); then
        echo -e "\e[31m❌ init failed, couldn't clone git judilibre-admin repository \e[0m" && exit 1;
        if [ "${GIT_BRANCH}" == "master" ]; then
            cd judilibre-admin;
            git checkout master;
            cd ..;
        fi;
    fi;
fi;

# scripts

for file in $(ls ${SCRIPTS_SRC}); do
    if [ ! -f "./scripts/$file" ]; then
        ln -s ${SCRIPTS_SRC}/$file ./scripts/$file;
    fi;
done;

# kube configs
if [ ! -d "k8s/" ];then
    ln -s ${KUBE_SRC} ./k8s;
fi;


# elastic configs
if [ ! -d "elastic/" ]; then
    ln -s ${ELASTIC_SRC} ./elastic;
fi;
