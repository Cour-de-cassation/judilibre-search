const taxon = {
  creation: 'Date de création',
  update: 'Date de mise à jour',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  default: Object.keys(taxon)[0],
  taxonomy: taxon,
};
