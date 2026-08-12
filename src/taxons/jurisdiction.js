const taxon = {
  cc: 'Cour de cassation',
  ca: "Cour d'appel",
  tj: 'Tribunal judiciaire',
  tcom: 'Tribunal de commerce',
  cph: "Conseil de prud'hommes",
  /*
  tc: 'Tribunal des conflits',
  tgi: 'Tribunal de grande instance de Paris',
  other: 'Autre',
  */
};

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
};
