#!/bin/bash
echo Test GET routes
for route in healthcheck search;do
  if curl -s -XGET http://localhost:${API_PORT}/${route} | grep -q '"route":"GET /'${route}'"' ; then
      echo "✅ ${route}"
  else
      echo -e "\e[31m❌ ${route} !\e[0m"
      exit 1
  fi
done
