const taxonsEntries = [
  'chamber',
  'committee',
  'date_type',
  'field',
  'formation',
  'jurisdiction',
  'operator',
  'order',
  'publication',
  'solution',
  'sort',
  'theme',
  'type',
];

const taxons = {};

taxonsEntries.forEach((taxon) => {
  taxons[taxon] = require(`./${taxon}`);
});

module.exports = taxons;
