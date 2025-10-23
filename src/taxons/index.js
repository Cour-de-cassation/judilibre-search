const taxonsEntries = [
  'chamber',
  'date_type',
  'field',
  'filetype',
  'formation',
  'jurisdiction',
  'location',
  'operator',
  'order',
  'publication',
  'solution',
  'sort',
  'source',
  'theme',
  'type',
];

const taxons = {
  cc: {},
  ca: {},
  tj: {},
  tcom: {},
  all: {},
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

taxonsEntries.forEach((taxon) => {
  taxons[taxon] = require(`./${taxon}`);
  taxons.cc[taxon] = require(`./${taxon}`);
  taxons.ca[taxon] = require(`./${taxon}`);
  taxons.tj[taxon] = require(`./${taxon}`);
  taxons.tcom[taxon] = require(`./${taxon}`);
  taxons.all[taxon] = {};
  if (taxons[taxon].options) {
    taxons.all[taxon].options = JSON.parse(JSON.stringify(taxons[taxon].options));
  }
  if (taxons[taxon].keys) {
    taxons.all[taxon].keys = JSON.parse(JSON.stringify(taxons[taxon].keys));
  }
  if (taxons[taxon].default) {
    taxons.all[taxon].default = JSON.parse(JSON.stringify(taxons[taxon].default));
  }
  if (taxons[taxon].taxonomy) {
    taxons.all[taxon].taxonomy = JSON.parse(JSON.stringify(taxons[taxon].taxonomy));
  }
  try {
    taxons.ca[taxon] = require(`./ca/${taxon}`);
    if (taxons.all[taxon].options && taxons.ca[taxon].options) {
      taxons.all[taxon].options = taxons.all[taxon].options.concat(
        JSON.parse(JSON.stringify(taxons.ca[taxon].options)),
      );
      taxons.all[taxon].options = taxons.all[taxon].options.filter(onlyUnique);
    }
    if (taxons.all[taxon].keys && taxons.ca[taxon].keys) {
      taxons.all[taxon].keys = taxons.all[taxon].keys.concat(JSON.parse(JSON.stringify(taxons.ca[taxon].keys)));
      taxons.all[taxon].keys = taxons.all[taxon].keys.filter(onlyUnique);
    }
  } catch (ignore) {
    taxons.ca[taxon] = require(`./${taxon}`);
  }
  try {
    taxons.tj[taxon] = require(`./tj/${taxon}`);
    if (taxons.all[taxon].options && taxons.tj[taxon].options) {
      taxons.all[taxon].options = taxons.all[taxon].options.concat(
        JSON.parse(JSON.stringify(taxons.tj[taxon].options)),
      );
      taxons.all[taxon].options = taxons.all[taxon].options.filter(onlyUnique);
    }
    if (taxons.all[taxon].keys && taxons.tj[taxon].keys) {
      taxons.all[taxon].keys = taxons.all[taxon].keys.concat(JSON.parse(JSON.stringify(taxons.tj[taxon].keys)));
      taxons.all[taxon].keys = taxons.all[taxon].keys.filter(onlyUnique);
    }
  } catch (ignore) {
    taxons.tj[taxon] = require(`./${taxon}`);
  }
  try {
    taxons.tcom[taxon] = require(`./tcom/${taxon}`);
    if (taxons.all[taxon].options && taxons.tcom[taxon].options) {
      taxons.all[taxon].options = taxons.all[taxon].options.concat(
        JSON.parse(JSON.stringify(taxons.tcom[taxon].options)),
      );
      taxons.all[taxon].options = taxons.all[taxon].options.filter(onlyUnique);
    }
    if (taxons.all[taxon].keys && taxons.tcom[taxon].keys) {
      taxons.all[taxon].keys = taxons.all[taxon].keys.concat(JSON.parse(JSON.stringify(taxons.tcom[taxon].keys)));
      taxons.all[taxon].keys = taxons.all[taxon].keys.filter(onlyUnique);
    }
  } catch (ignore) {
    taxons.tcom[taxon] = require(`./${taxon}`);
  }
});

module.exports = taxons;
