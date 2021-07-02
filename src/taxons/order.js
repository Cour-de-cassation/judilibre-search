const taxon = {
  asc: 'Croissant',
  desc: 'Décroissant',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  default: Object.keys(taxon)[1],
  taxonomy: taxon,
};
