const taxon = {
  arret: 'Arrêt',
  qpc: 'Question prioritaire de constitutionnalité',
  qpj: 'Question préjudicielle',
  ordonnance: 'Ordonnance',
  saisie: 'Saisie',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
};
