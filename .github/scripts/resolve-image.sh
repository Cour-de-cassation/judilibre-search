#!/usr/bin/env bash
# Détermine l'image à déployer, et la construit si elle n'est pas déjà publiée.
#
# Référence fournie en entrée : elle est déployée telle quelle, sans
# construction ni accès au registre. C'est le mode qui permet de redéployer une
# image déjà en service, ou de revenir à une version antérieure.
#
# Référence absente : l'image est celle du commit sur lequel le workflow tourne,
# étiquetée par son empreinte courte. Si le registre la porte déjà, rien n'est
# reconstruit — déployer plusieurs clusters depuis un même commit livre alors le
# même artefact, au lieu d'autant de constructions distinctes.
#
# L'étiquette est l'empreinte du commit plutôt qu'un numéro de version : c'est la
# convention de la chaîne privée, dont les images sont nommées par le sha court.
# Et une empreinte ne se déplace pas, contrairement à `latest` ou au nom d'une
# branche : la même référence déploie la même chose des mois plus tard.
set -euo pipefail

if [ -z "${GITHUB_ENV:-}" ]; then
    echo "❌ GITHUB_ENV est vide — ce script s'exécute dans un job GitHub Actions." >&2
    exit 1
fi

if [ -n "${INPUT_IMAGE:-}" ]; then
    reference="${INPUT_IMAGE}"
    echo "▶ référence fournie : ${reference}"
    echo "  aucune construction, aucun accès à Docker Hub."
else
    for variable in DOCKERHUB_USERNAME DOCKERHUB_TOKEN; do
        if [ -z "${!variable:-}" ]; then
            echo "❌ ${variable} est vide — le secret correspondant manque au dépôt." >&2
            exit 1
        fi
    done

    empreinte="$(git rev-parse --short=7 HEAD)"
    reference="${DOCKERHUB_USERNAME}/judilibre-search:${empreinte}"
    echo "▶ image du commit : ${reference}"

    echo "${DOCKERHUB_TOKEN}" | docker login -u "${DOCKERHUB_USERNAME}" --password-stdin

    if docker manifest inspect "${reference}" >/dev/null 2>&1; then
        echo "✅ déjà publiée — rien à construire."
    else
        # Le dernier étage du Dockerfile est « local », destiné au développement,
        # et Docker prend le dernier étage par défaut : l'étage « production »
        # se vise explicitement, comme le font la chaîne privée et tag.yml.
        echo "▶ construction puis publication"
        docker build --target=production --tag "${reference}" .
        docker push "${reference}"
        echo "✅ publiée."
    fi
fi

# Les étapes suivantes — déploiement et retour arrière — lisent IMAGE d'ici, et
# de nulle part ailleurs : une seule source, pour qu'elles ne divergent pas.
echo "IMAGE=${reference}" >> "${GITHUB_ENV}"

# Le titre du run est figé avant l'exécution et ne peut donc pas porter une
# référence résolue ici. Le résumé, lui, s'affiche sur la page du run : c'est là
# que se lit ce qui a réellement été déployé.
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
    {
        echo "### Image déployée"
        echo
        echo '```'
        echo "${reference}"
        echo '```'
    } >> "${GITHUB_STEP_SUMMARY}"
fi
