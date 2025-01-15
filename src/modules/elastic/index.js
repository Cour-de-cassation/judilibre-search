require('../env');

class Elastic {
  constructor() {
    if (process.env.WITHOUT_ELASTIC) {
      this.data = null;
    } else {
      const { Client } = require('@elastic/elasticsearch');
      this.client = new Client({ node: `${process.env.ELASTIC_NODE}`, ssl: { rejectUnauthorized: false } });
    }
  }

  buildQuery(query, target, relaxed) {
    return require('./query').apply(this, [query, target, relaxed]);
  }

  async published(query) {
    return await require('./published').apply(this, [query]);
  }

  async search(query) {
    return await require('./search').apply(this, [query]);
  }

  async decision(query) {
    return await require('./decision').apply(this, [query]);
  }

  async export(query) {
    return await require('./export').apply(this, [query]);
  }

  async exportTransaction(query) {
    return await require('./exportTransaction').apply(this, [query]);
  }

  async stats(query) {
    return await require('./stats').apply(this, [query]);
  }
}

module.exports = new Elastic();
