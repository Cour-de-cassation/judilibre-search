const taxon = {
  civ1: 'Première chambre civile',
  civ2: 'Deuxième chambre civile',
  civ3: 'Troisième chambre civile',
  comm: 'Chambre commerciale, économique et financière',
  cr: 'Chambre criminelle',
  soc: 'Chambre sociale',
  mi: 'Chambre mixte',
  pl: 'Assemblée plénière',
  ordo: 'Première présidence (Ordonnance)',
  creun: 'Chambres réunies',
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
