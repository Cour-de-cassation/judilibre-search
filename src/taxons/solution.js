const taxon = {
  annulation: 'Annulation',
  avis: 'Avis',
  cassation: 'Cassation',
  decheance: 'Déchéance',
  designation: 'Désignation de juridiction',
  irrecevabilite: 'Irrecevabilité',
  nonlieu: 'Non-lieu à statuer',
  qpc: 'QPC',
  rabat: 'Rabat',
  reglement: 'Règlement des juges',
  rejet: 'Rejet',
  renvoi: 'Renvoi',
  autre: 'Autre',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
