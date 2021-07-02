const taxon = {
  pl: 'Assemblée plénière',
  mi: 'Chambre mixte',
  civ1: 'Première chambre civile',
  civ2: 'Deuxième chambre civile',
  civ3: 'Troisième chambre civile',
  comm: 'Chambre commerciale, financière et économique',
  soc: 'Chambre sociale',
  cr: 'Chambre criminelle',
  ordo: 'Première présidence (Ordonnance)',
  creun: 'Chambres réunies',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
