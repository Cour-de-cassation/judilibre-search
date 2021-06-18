const taxon = {
  text: 'Texte entier',
  introduction: 'Introduction',
  expose: 'Exposé du litige',
  moyens: 'Moyens',
  motivations: 'Motivations',
  dispositif: 'Dispositif',
  annexes: 'Moyens annexés',
  visa: 'Textes appliqués',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
