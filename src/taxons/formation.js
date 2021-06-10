const taxon = {
  f: 'Formation ordinaire',
  fs: 'Formation de section',
  fp: 'Formation plénière de chambre',
  frh: 'Formation restreinte hors RNSM',
  frr: 'Formation restreinte RNSM',
  fm: 'Formation mixte',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
