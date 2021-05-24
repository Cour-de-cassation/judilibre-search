const taxon = {
  score: 'Par pertinence',
  scorepub: 'Par pertinence et niveau de publication',
  date: 'Par date',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  default: Object.keys(taxon)[1],
  taxonomy: taxon,
};
