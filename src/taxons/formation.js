const taxon = {
  f: 'Formation ordinaire',
  fs: 'Formation de section',
  fp: 'Formation plénière de chambre',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
