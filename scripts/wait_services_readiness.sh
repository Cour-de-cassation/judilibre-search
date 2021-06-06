# wait for k8s pods to be ready
: "${KUBECTL:=kubectl}"

timeout=${START_TIMEOUT} ;
for POD in ${APP_ID} ${APP_GROUP}-es; do
    ret=1 ;\
    until [ "$timeout" -le 0 -o "$ret" -eq "0" ] ; do\
            status=$(${KUBECTL} get pod --namespace=${APP_GROUP} | grep ${POD} | awk '{print $2}');
            (echo $status | grep -v '0/1' | grep -q '1/1' );\
            ret=$? ; \
            if [ "$ret" -ne "0" ] ; then printf "\r\033[2K%03d Wait for service ${POD} to be ready" $timeout ; fi ;\
            ((timeout--)); sleep 1 ; \
    done ;
done;

if [ "$ret" -ne "0" ]; then
        echo -en "\r\033[2K\e[31m❌  all service are not ready !\e[0m\n";
        ${KUBECTL} get pod --namespace=${APP_GROUP};
        exit 1;
fi;

ret=0;ok=""
until [ "$timeout" -le 0 -o ! -z "$ok" ] ; do
        lb=$(${KUBECTL} get service --namespace=kube-system | grep -i loadbalancer | grep -v pending | awk '{print $1}');
        if [ ! -z "$lb" ]; then
            ret=$(${KUBECTL} describe service/${lb} --namespace=kube-system | grep Endpoints | awk 'BEGIN{s=0}($2){s++}END{printf s}');
        fi;
        if [ "$ret" -eq "0" ] ; then
            printf "\r\033[2K%03d Wait for Loadbalancer to be ready" $timeout;
        else
            if (curl -s -o /dev/null -k -XGET ${APP_SCHEME}://${APP_HOST}:${APP_PORT}); then
                ok="ok";
            else
                printf "\r\033[2K%03d Wait for Endpoints to be ready" $timeout;
            fi;
        fi;
        ((timeout--)); sleep 1 ;
done ;

if [ -z "$ok" ];then
        (echo -en "\r\033[2K\e[31m❌  all pods are not ready !\e[0m\n" && (${KUBECTL} get service --namespace=kube-system | grep -i loadbalancer) && exit 1)
else
        (echo -en "\r\033[2K✓   all pods are ready\n")
fi;

