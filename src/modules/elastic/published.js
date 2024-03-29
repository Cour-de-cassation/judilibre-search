require('../env');

async function published(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return publishedWithoutElastic.apply(this, [query]);
  }

  let rawResponse;
  let response = {
    published: false,
  };

  try {
    rawResponse = await this.client.get({
      id: query.id,
      index: process.env.ELASTIC_INDEX,
      _source: false,
    });
  } catch (ignore) {
    rawResponse = null;
  }

  if (rawResponse && rawResponse.body && rawResponse.body.found) {
    response = {
      published: true,
    };
  }

  return response;
}

function publishedWithoutElastic(query) {
  return {
    published: true,
  };
}

module.exports = published;
