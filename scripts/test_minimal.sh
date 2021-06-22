#!/bin/bash
echo Test GET routes on ${APP_SCHEME}://${APP_HOST}:${APP_PORT}
if curl -s -k --retry 5 --retry-delay 2 -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck | grep -q '"status":' ; then
    echo "✅ healthcheck"
else
    echo -e "\e[31m❌ healthcheck !\e[0m"
    echo curl -k -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck
    curl -k -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck
    exit 1
fi
if curl -s -k --retry 5 --retry-delay 2 -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/search | grep -q '"results":' ; then
    echo "✅ search"
else
    echo -e "\e[31m❌ search !\e[0m"
    echo curl -k -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/search
    curl -k -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/search
    exit 1
fi
