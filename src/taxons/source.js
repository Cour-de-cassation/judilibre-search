const taxon = {
  dila: 'dila',
  jurinet: 'jurinet',
  jurica: 'jurica',
  juricav2: 'juricav2',
  juritj: 'juritj',
  juritcom: 'juritcom'
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
