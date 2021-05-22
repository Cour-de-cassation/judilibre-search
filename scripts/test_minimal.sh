#!/bin/bash
echo Test GET routes
for route in healthcheck search;do
  if curl -s --retry 5 --retry-delay 2 -XGET http://localhost:${API_PORT}/${route} | grep -q '"route":"GET /'${route}'"' ; then
      echo "✅ ${route}"
  else
      echo -e "\e[31m❌ ${route} !\e[0m"
      echo curl -XGET http://localhost:${API_PORT}/${route}
      curl -XGET http://localhost:${API_PORT}/${route}
      exit 1
  fi
done
