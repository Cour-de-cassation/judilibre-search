#!/bin/bash
echo Test GET routes on ${SCHEME}://${HOST}:${API_PORT}
for route in healthcheck search;do
  if curl -s --retry 5 --retry-delay 2 -XGET ${SCHEME}://${HOST}:${API_PORT}/${route} | grep -q '"query":' ; then
      echo "✅ ${route}"
  else
      echo -e "\e[31m❌ ${route} !\e[0m"
      echo curl -XGET ${SCHEME}://${HOST}:${API_PORT}/${route}
      curl -XGET ${SCHEME}://${HOST}:${API_PORT}/${route}
      exit 1
  fi
done
