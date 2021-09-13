const taxon = {
  cassation: 'Cassation',
  rejet: 'Rejet',
  annulation: 'Annulation',
  avis: 'Avis',
  decheance: 'Déchéance',
  designation: 'Désignation de juridiction',
  irrecevabilite: 'Irrecevabilité',
  nonlieu: 'Non-lieu à statuer',
  qpc: 'QPC renvoi',
  qpcother: 'QPC autres',
  rabat: 'Rabat',
  reglement: 'Règlement des juges',
  renvoi: 'Renvoi',
  other: 'Autre',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
