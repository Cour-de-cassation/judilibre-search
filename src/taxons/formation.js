const taxon = {
  fp: 'Formation plénière de chambre',
  fm: 'Formation mixte',
  fs: 'Formation de section',
  f: 'Formation restreinte',
  frh: 'Formation restreinte hors RNSM/NA',
  frr: 'Formation restreinte RNSM/NA',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
