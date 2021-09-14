const taxon = {
  prep_rapp: 'Rapport du rapporteur',
  prep_avis: 'Avis de l’avocat général',
  prep_oral: 'Avis oral de l’avocat général',
  comm_comm: 'Communiqué',
  comm_note: 'Note explicative',
  comm_nora: 'Notice au rapport annuel',
  comm_lett: 'Lettre de chambre',
  comm_trad: 'Arrêt traduit',
};

const importCode = {
  comm_trad: 7,
  prep_avis: 2,
  prep_oral: 3,
  comm_comm: 4,
  comm_lett: 6,
  comm_note: 5,
  comm_nora: 8,
  prep_rapp: 1,
};

function getCodeFromImportType(type) {
  if (typeof type === 'string') {
    type = parseInt(type, 10);
  }
  for (let key in importCode) {
    if (type === importCode[key]) {
      return key;
    }
  }
  return null;
}

function isCommunicationDoc(type) {
  const key = getCodeFromImportType(type);
  return key && key.indexOf('comm') !== -1;
}

function buildFilesList(files, resolve_references) {
  const filesList = [];
  const path = require('path');

  if (Array.isArray(files) && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const code = getCodeFromImportType(files[i].type);
      let file = {
        id: files[i].id,
        type: resolve_references && taxon[code] ? taxon[code] : code,
        isCommunication: isCommunicationDoc(files[i].type),
        date: files[i].date, // @TODO format
      };
      if (files[i].size && files[i].location) {
        file.name = files[i].name;
        file.size = files[i].size;
        file.url = files[i].location;
      } else {
        file.name = path.parse(files[i].name).name;
        file.url = files[i].name;
      }
      filesList.push(file);
    }
  }

  return filesList;
}

module.exports = {
  options: [''].concat(Object.keys(taxon)),
  keys: Object.keys(taxon),
  taxonomy: taxon,
  getCodeFromImportType: getCodeFromImportType,
  isCommunicationDoc: isCommunicationDoc,
  buildFilesList: buildFilesList,
};
