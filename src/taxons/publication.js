const taxon = {
  b: 'Publié au Bulletin',
  r: 'Publié au Rapport',
  l: 'Publié aux Lettres de chambre',
  c: 'Communiqué',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
