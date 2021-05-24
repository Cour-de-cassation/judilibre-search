const taxon = {
  asc: 'Ascendant',
  desc: 'Descendant',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  default: Object.keys(taxon)[1],
  taxonomy: taxon,
};
