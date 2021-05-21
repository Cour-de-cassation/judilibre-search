const taxon = {
  expose: 'Exposé du litige',
  moyens: 'Moyens',
  motivations: 'Motivations',
  dispositif: 'Dispositif',
  annexes: 'Moyens annexés',
  pourvoi: 'Numéro de pourvoi',
  visa: 'Visa',
  sommaire: 'Sommaire',
  titrage: 'Titrage',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
};
