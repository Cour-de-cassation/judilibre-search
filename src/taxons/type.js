// @TODO info not in DB

const taxon = {
  arret: 'Arrêt',
  demande: "Demande d'avis",
  qpc: 'Question prioritaire de constitutionnalité',
  qpj: 'Question préjudicielle',
  ordonnance: 'Ordonnance',
  saisie: 'Saisie',
  autre: 'Autre',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
