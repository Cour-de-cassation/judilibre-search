const taxon = {
  or: 'Ou',
  and: 'Et',
  exact: 'Expression exacte',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  default: Object.keys(taxon)[0],
  taxonomy: taxon,
};
