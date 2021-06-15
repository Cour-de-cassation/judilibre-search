const taxon = {
  expose: 'Exposé du litige',
  moyens: 'Moyens',
  motivations: 'Motivations',
  dispositif: 'Dispositif',
  annexes: 'Moyens annexés',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
