require('../env');

async function head(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return headWithoutElastic.apply(this, [query]);
  }

  let rawResponse;
  let response = null;

  try {
    rawResponse = await this.client.get({
      id: query.id,
      index: process.env.ELASTIC_INDEX,
      _source: true,
    });
  } catch (e) {
    rawResponse = null;
  }

  if (rawResponse && rawResponse.body && rawResponse.body.found) {
    response = {
      id: query.id,
    };
  }

  return response;
}

function headWithoutElastic(query) {
  return {
    id: query.id,
  };
}

module.exports = head;
