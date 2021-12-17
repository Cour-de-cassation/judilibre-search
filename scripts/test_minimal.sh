#!/bin/bash

export CURL="curl -s --retry 5 --retry-delay 2 --max-time 5"

if [ ! -z "${APP_SELF_SIGNED}" ];then
  export CURL="${CURL} -k"
fi;

if [ "${ACME}" == "acme-staging" ];then
  curl -s https://letsencrypt.org/certs/staging/letsencrypt-stg-root-x1.pem -o letsencrypt-stg-root-x1.pem
  export CURL="${CURL} --cacert letsencrypt-stg-root-x1.pem"
fi;

if ${CURL} ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck | grep -q '"status":' ; then
    echo "✅  test api ${APP_HOST}/healthcheck"
else
    if ${CURL} -k ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck | grep -q '"status":' ; then
        echo -e "\e[33m⚠️   test api ${APP_HOST}/healthcheck (invalid SSL cert)\e[0m"
    else
        echo -e "\e[31m❌ test api ${APP_HOST}/healthcheck !\e[0m"
        echo ${CURL} ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck
        ${CURL} ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck
        exit 1
    fi
fi

if ${CURL} ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/search | grep -q '"results":' ; then
    echo "✅  test api ${APP_HOST}/search"
else
    if ${CURL} -k ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/search | grep -q '"results":' ;then
        echo -e "\e[33m⚠️   test api ${APP_HOST}/search (invalid SSL cert)\e[0m";
        exit 2;
    else
        echo -e "\e[31m❌ test api ${APP_HOST}/search !\e[0m";
        echo ${CURL} ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/search;
        ${CURL} ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/search;
        exit 1;
    fi;
fi
