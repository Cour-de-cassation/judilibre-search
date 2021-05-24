const taxonsEntries = [
  'chamber',
  'committee',
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
