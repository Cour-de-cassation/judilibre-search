#!/bin/bash
timeout=10 ; ret=1 ;\
until [ "$timeout" -le 0 -o "$ret" -eq "0"  ] ; do\
        (curl -s -XGET http://localhost:${API_PORT}/healthcheck > /dev/null);\
        ret=$? ; \
        if [ "$ret" -ne "0" ] ; then echo -en "\rWait for service ${APP_ID} to start ... $timeout" ; fi ;\
        ((timeout--)); sleep 1 ; \
done ;
