require('../env');

async function published(query) {
  const response = {};
  for (let i = 0; i < query.id.length; i++) {
    const id = query.id[i];
    if (process.env.WITHOUT_ELASTIC) {
      response[id] = await publishedWithoutElastic.apply(this, [id]);
    } else {
      response[id] = await publishedWithElastic.apply(this, [id]);
    }
  }
  return response;
}

async function publishedWithoutElastic(id) {
  return true;
}

async function publishedWithElastic(id) {
  let response;
  try {
    response = await this.client.get({
      id: id,
      index: process.env.ELASTIC_INDEX,
      _source: false,
    });
  } catch (ignore) {
    response = null;
  }
  if (response && response.body && response.body.found) {
    return true;
  }
  return false;
}

module.exports = published;
