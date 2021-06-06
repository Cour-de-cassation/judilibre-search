#!/bin/bash
echo Test GET routes on ${APP_SCHEME}://${APP_HOST}:${APP_PORT}
for route in healthcheck search;do
  if curl -s -k --retry 5 --retry-delay 2 -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/${route} | grep -q '"query":' ; then
      echo "✅ ${route}"
  else
      echo -e "\e[31m❌ ${route} !\e[0m"
      echo curl -k -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/${route}
      curl -k -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/${route}
      exit 1
  fi
done
