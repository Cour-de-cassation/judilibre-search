require('./env');
const { Client } = require('@elastic/elasticsearch');

class Elastic {
  constructor() {
    this.client = new Client({ node: `http://${process.env.ELASTIC_NODE}` });
  }

  query() {}
}

module.exports = new Elastic();
