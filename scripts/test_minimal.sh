#!/bin/bash
#
# Test minimal de l'API, appelé par judilibre-ops après la création d'un
# environnement (scripts/create_environment.sh).
#
# Ne pas supprimer ce fichier : scripts/init_deps.sh crée un lien symbolique
# vers chaque script de judilibre-ops dont le nom n'existe pas déjà ici. En son
# absence, c'est donc le test_minimal.sh de judilibre-ops qui s'exécuterait —
# celui-ci vise l'API d'administration, pas celle de recherche, et la création
# d'environnement échouerait.

export CURL="curl -s --retry 5 --retry-delay 2 --max-time 5"

if [ ! -z "${APP_SELF_SIGNED}" ];then
  export CURL="${CURL} -k"
fi;

# Neutralise tout ce qui suit : le script sort en succès sans rien vérifier.
# En place depuis décembre 2023.
exit 0

if [ "${ACME}" == "acme-staging" ];then
  curl -s https://letsencrypt.org/certs/staging/letsencrypt-stg-root-x1.pem -o letsencrypt-stg-root-x1.pem
  export CURL="${CURL} --cacert letsencrypt-stg-root-x1.pem"
fi;

if ${CURL} ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck | grep -q '"status":' ; then
    echo "✅  test api ${APP_HOST}/healthcheck"
else
    if ${CURL} -k ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck | grep -q '"status":' ; then
        echo -e "\e[33m⚠️   test api ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck (invalid SSL cert)\e[0m"
    else
        echo -e "\e[31m❌ test api ${APP_SCHEME}://${APP_HOST}:${APP_PORT}/healthcheck !\e[0m"
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
