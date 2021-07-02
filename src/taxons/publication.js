const taxon = {
  b: 'Publié aux Bulletins',
  r: 'Publié au Rapport',
  l: 'Publié aux Lettres de chambre',
  c: 'Communiqué de presse',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
