require('../env');
const taxons = require('../../taxons');

async function stats(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return statsWithoutElastic.apply(this, [query]);
  }

  let response = {};

  // @TODO

  return response;
}

function statsWithoutElastic(query) {
  let response = {};

  // @TODO

  return response;
}

module.exports = stats;
