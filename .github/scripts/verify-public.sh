#!/usr/bin/env bash
# Contrôle de bout en bout après déploiement.
#
# Il n'interroge pas le pod mais l'URL publique, traversant l'Ingress, le
# certificat et le LoadBalancer — ce que les sondes du conteneur ne prouvent pas.
#
# Toutes les adresses sources n'obtiennent pas la même réponse : certaines
# reçoivent une redirection au lieu de l'API. Un tel retour n'apprend rien du
# déploiement et ne vaut donc pas échec, sous peine d'annuler une livraison
# saine. Le contrôle bascule alors sur un appel depuis le cluster : l'Ingress,
# le certificat et le LoadBalancer ne sont plus traversés, mais la réponse de
# l'application et l'accès à son Elasticsearch restent prouvés.
#
# Contrairement à judilibre-admin, l'API n'a pas d'authentification : aucun mot
# de passe n'est nécessaire ici, et un 401 n'est donc pas un cas attendu.
set -euo pipefail

if [ -z "${APP_HOST:-}" ]; then
    echo "❌ APP_HOST est vide." >&2
    exit 1
fi
if [ -z "${NAMESPACE:-}" ]; then
    echo "❌ NAMESPACE est vide — nécessaire au contrôle de repli." >&2
    exit 1
fi

corps="$(mktemp)"
erreur="$(mktemp)"
trap 'rm -f "${corps}" "${erreur}"' EXIT

# La réponse attendue est {"status":"disponible"}. Le test porte sur la paire
# complète, jamais sur le seul mot : « indisponible » le contient, et un
# `grep disponible` conclurait au succès alors que l'application signale son
# Elasticsearch injoignable.
attendu='"status"[[:space:]]*:[[:space:]]*"disponible"'

# Les tentatives couvrent le temps que met un nouveau pod à recevoir du trafic
# après la fin du rollout.
#
# Les redirections ne sont pas suivies : c'est justement ce qu'il faut pouvoir
# distinguer d'une réponse de l'application.
echo "▶ contrôle de https://${APP_HOST}/healthcheck"

set +e
code=$(curl -sS --fail --retry 5 --retry-delay 3 --retry-all-errors \
    --max-time 15 \
    -o "${corps}" -w '%{http_code}' \
    "https://${APP_HOST}/healthcheck" 2>"${erreur}")
statut=$?
set -e

if [ "${statut}" -eq 0 ] && [ "${code}" -ge 200 ] && [ "${code}" -lt 300 ]; then
    if grep -Eq "${attendu}" "${corps}"; then
        echo "✅ ${APP_HOST} répond, et se déclare disponible"
        exit 0
    fi
    echo "❌ réponse inattendue de ${APP_HOST} (HTTP ${code}) :" >&2
    head -c 500 "${corps}" >&2
    echo >&2
    exit 1
fi

if [ "${code}" -ge 300 ] && [ "${code}" -lt 400 ]; then
    echo "⚠️  HTTP ${code} : ce runner n'obtient pas l'API mais une redirection."
    echo "   Contrôle public non concluant — repli dans le cluster."
else
    echo "❌ l'API publique n'a pas répondu (HTTP ${code}, curl ${statut}) :" >&2
    head -c 500 "${erreur}" >&2
    echo >&2
    exit 1
fi

# ── Repli : la même requête, depuis le pod ────────────────────────────────────
echo "▶ contrôle interne de ${NAMESPACE}/judilibre-search-deployment"

set +e
reponse=$(kubectl --namespace="${NAMESPACE}" exec deploy/judilibre-search-deployment -- \
    sh -c "curl -sS --fail --retry 5 --retry-delay 3 --retry-all-errors --max-time 10 \
        'http://localhost:${APP_PORT:-8080}/healthcheck'" 2>&1)
statut=$?
set -e

if [ "${statut}" -ne 0 ]; then
    echo "❌ l'application n'a pas répondu depuis le cluster :" >&2
    printf '%s\n' "${reponse}" | head -c 500 >&2
    exit 1
fi

if printf '%s' "${reponse}" | grep -Eq "${attendu}"; then
    echo "✅ l'application répond et se déclare disponible, vue du cluster"
    echo "   ⚠️  Ingress, certificat et LoadBalancer n'ont pas été traversés."
    exit 0
fi

echo "❌ réponse inattendue depuis le cluster :" >&2
printf '%s\n' "${reponse}" | head -c 500 >&2
exit 1
