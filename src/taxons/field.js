const taxon = {
  expose: 'Exposé du litige',
  moyens: 'Moyens',
  motivations: 'Motivations',
  dispositif: 'Dispositif',
  annexes: 'Moyens annexés',
  number: 'Numéro de pourvoi',
  visa: 'Visa',
  summary: 'Sommaire',
  themes: 'Titrage',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
