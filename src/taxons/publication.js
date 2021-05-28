const taxon = {
  n: 'Non publié',
  b: 'Publié au bulletin',
  l: 'Publié à la lettre de chambre',
  r: 'Publié au rapport',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
