const taxon = {};

/* @TODO
CNRD, commission d’instruction des demandes en révision et en réexamen, Cour de révision et de réexamen des condamnations pénales, Cour de réexamen des décisions civiles
*/
module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
