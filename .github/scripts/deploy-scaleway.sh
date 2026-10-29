#!/usr/bin/env bash
# Déploie judilibre-search sur un cluster public Scaleway.
#
#   usage : deploy-scaleway.sh <groupe-de-inventaire>
#
# Le groupe désigne le cluster ; tout le reste vient de ses group_vars.
set -euo pipefail

if [ "$#" -lt 1 ]; then
    echo "usage : $0 <groupe-de-inventaire>" >&2
    exit 1
fi
groupe="$1"

if [ -z "${IMAGE:-}" ]; then
    echo "❌ IMAGE est vide — impossible de savoir quoi déployer." >&2
    exit 1
fi

# group_vars/all/vault.yml est chiffré et se charge pour tout hôte : le mot de
# passe du vault est requis même quand le playbook ne lit aucun secret.
if [ -z "${ANSIBLE_VAULT_PASSWORD:-}" ]; then
    echo "❌ ANSIBLE_VAULT_PASSWORD est vide — le secret manque au dépôt." >&2
    exit 1
fi

# La whitelist IP de l'Ingress vit dans judilibre-ops, privé : ce dépôt et ses
# journaux sont publics. Elle n'est jamais affichée.
if [ -z "${GIT_TOKEN:-}" ]; then
    echo "❌ GIT_TOKEN est vide — impossible de lire la whitelist dans judilibre-ops." >&2
    exit 1
fi

fichier_vault="$(mktemp)"
dossier_ops="$(mktemp -d)"
fichier_whitelist="$(mktemp)"
trap 'rm -rf "${fichier_vault}" "${dossier_ops}" "${fichier_whitelist}"' EXIT
printf '%s' "${ANSIBLE_VAULT_PASSWORD}" > "${fichier_vault}"
chmod 600 "${fichier_vault}" "${fichier_whitelist}"

# Le jeton passe par un en-tête, jamais par l'URL, qu'une erreur recopierait.
git -c http.extraheader="AUTHORIZATION: basic $(printf 'x-access-token:%s' "${GIT_TOKEN}" | base64 -w0)" \
    clone --quiet --depth 1 https://github.com/Cour-de-cassation/judilibre-ops.git "${dossier_ops}"
whitelist="$(bash "${dossier_ops}/scripts/whitelist-search.sh" | tr -d '\r ')"
printf 'judilibre_search_ingress_whitelist: "%s"\n' "${whitelist}" > "${fichier_whitelist}"

echo "▶ ${groupe} — image ${IMAGE}"

ANSIBLE_FORCE_COLOR=true \
ansible-playbook \
    -i ansible/inventory/scw.yml \
    --limit "${groupe}" \
    --vault-password-file "${fichier_vault}" \
    -e "app_image=${IMAGE}" \
    -e "@${fichier_whitelist}" \
    ansible/deploy_app_public.yml
