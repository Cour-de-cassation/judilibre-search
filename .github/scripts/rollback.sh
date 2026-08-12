#!/usr/bin/env bash
# Revient à la révision précédente du Deployment.
#
# Avec maxUnavailable à 0, l'ancien pod sert toujours pendant un rollout raté :
# il n'y a pas de coupure à rattraper, mais l'objet resterait à mi-chemin sans
# cette étape.
#
# Le retour arrière n'a lieu que si ce passage a effectivement écrit le
# Deployment : un échec survenu plus tôt ne laisse rien à annuler, et un
# `rollout undo` y ferait reculer une révision saine. L'image du Deployment
# vivant sert de témoin — tant qu'elle n'est pas celle demandée, l'apply n'a
# pas atteint le cluster.
#
# kubectl signale par ailleurs qu'un retour arrière sur un objet géré par
# `apply` laisse `last-applied-configuration` inchangée, ce qui fausse l'apply
# suivant. Raison de plus pour ne s'y résoudre qu'à bon escient.
set -euo pipefail

if [ -z "${NAMESPACE:-}" ]; then
    echo "❌ NAMESPACE est vide." >&2
    exit 1
fi
if [ -z "${IMAGE:-}" ]; then
    echo "❌ IMAGE est vide — impossible de savoir si l'apply a atteint le cluster." >&2
    exit 1
fi

image_vivante=$(kubectl --namespace="${NAMESPACE}" get deployment judilibre-search-deployment \
    -o jsonpath='{.spec.template.spec.containers[0].image}' 2>/dev/null || true)

if [ "${image_vivante}" != "${IMAGE}" ]; then
    echo "⏭️  Rien à défaire : le Deployment porte toujours ${image_vivante:-aucune image}."
    echo "   L'échec est survenu avant que l'apply n'atteigne le cluster."
    exit 0
fi

echo "↩ retour arrière sur ${NAMESPACE}/judilibre-search-deployment"
kubectl --namespace="${NAMESPACE}" rollout undo deployment/judilibre-search-deployment
kubectl --namespace="${NAMESPACE}" rollout status deployment/judilibre-search-deployment --timeout=180s
echo "✅ révision précédente rétablie"
