const taxon = {
  b: 'Publié au Bulletin',
  r: 'Publié au Rapport',
  l: 'Publié aux Lettres de chambre',
  c: 'Communiqué',
  n: 'Non publié',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
