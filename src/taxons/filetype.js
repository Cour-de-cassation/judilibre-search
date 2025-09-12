const taxon = {
  prep_rapp: 'Rapport du conseiller',
  prep_raco: 'Rapport complémentaire du conseiller',
  prep_avpg: 'Avis du procureur général',
  prep_avis: 'Avis de l’avocat général',
  prep_oral: 'Avis oral de l’avocat général',
  prep_avco: 'Avis complémentaire de l’avocat général',
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
  prep_avco: 11,
  comm_comm: 4,
  comm_lett: 6,
  comm_note: 5,
  comm_nora: 8,
  prep_rapp: 1,
  prep_raco: 9,
  prep_avpg: 10,
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

function buildFilesList(decisionId, files, resolve_references) {
  const filesList = [];
  const path = require('path');

  if (Array.isArray(files) && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const code = getCodeFromImportType(files[i].type);
      let fileDate = new Date(files[i].date);
      let fileDateForDisplay = fileDate.getFullYear() + '-';
      fileDateForDisplay += (fileDate.getMonth() < 9 ? '0' + (fileDate.getMonth() + 1) : fileDate.getMonth() + 1) + '-';
      fileDateForDisplay += fileDate.getDate() < 10 ? '0' + fileDate.getDate() : fileDate.getDate();
      let file = {
        id: files[i].id,
        type: resolve_references && taxon[code] ? taxon[code] : code,
        isCommunication: isCommunicationDoc(files[i].type),
        date: fileDateForDisplay,
      };
      if (files[i].size && files[i].location) {
        file.name = files[i].name;
        file.size = files[i].size;
        file.url = `https://${process.env.APP_HOST_ALTER}/decision?id=${decisionId}&fileId=${files[i].id}`;
        file.rawUrl = files[i].location;
      } else {
        file.name = path.parse(files[i].name).name;
        file.url = files[i].name;
      }
      if (code === 'prep_rapp') {
        filesList.unshift(file);
      } else {
        filesList.push(file);
      }
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
