const taxon = {
  arret: 'Arrêt',
  avis: "Demande d'avis",
  qpc: 'Question prioritaire de constitutionnalité (QPC)',
  // qpj: 'Question préjudicielle',
  ordonnance: 'Ordonnance',
  saisie: 'Saisie',
  other: 'Autre',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
