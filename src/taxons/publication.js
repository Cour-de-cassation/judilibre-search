const taxon = {
  b: 'Publié au Bulletin',
  l: 'Publié aux Lettres de chambre',
  r: 'Publié au Rapport',
  c: 'Communiqué de presse',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
