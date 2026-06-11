const taxon = {
  dila: 'dila',
  jurinet: 'jurinet',
  jurica: 'jurica',
  juritj: 'juritj',
  juritcom: 'juritcom',
  'portalis-cph': 'portalis-cph',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
