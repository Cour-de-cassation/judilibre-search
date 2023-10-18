const taxon = {
  arret: 'Arrêt',
  ordonnance: 'Ordonnance',
  other: 'Autre',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
