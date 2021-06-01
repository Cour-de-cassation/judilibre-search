require('./env');
const { Client } = require('@elastic/elasticsearch');

class Elastic {
  constructor() {
    this.client = new Client({ node: `http://${process.env.ELASTIC_NODE}` });
  }

  async search(query) {
    const page = query.page || 0;
    const page_size = query.page_size || 10;
    const searchString = query.query.trim().split(/\s+/gm);
    for (let i = 0; i < searchString.length; i++) {
      if (/^\d\d[^\w\d]\d\d[^\w\d]\d\d\d$/.test(searchString[i])) {
        searchString[i] = searchString[i].replace(/[^\w\d]/gm, '');
      }
    }
    // @TODO build query
    try {
      const rawResponse = await this.client.search(query);
      const response = {
        page: page,
        page_size: page_size,
        query: query,
        total: 0,
        previous_page: null,
        next_page: null,
        took: 0,
        max_score: 0,
        results: [],
      };
      if (rawResponse) {
        if (rawResponse.hits && rawResponse.hits.total && rawResponse.hits.total.value > 0) {
          response.total = rawResponse.hits.total.value;
          response.max_score = rawResponse.hits.max_score;
          if (page > 0) {
            const previous_page_params = new URLSearchParams(query);
            previous_page_params.set('page', page - 1);
            response.previous_page = previous_page_params.toString();
          }
          if ((page + 1) * page_size < rawResponse.hits.total.value) {
            const next_page_params = new URLSearchParams(query);
            next_page_params.set('page', page + 1);
            response.next_page = next_page_params.toString();
          }
          rawResponse.hits.hits.forEach((result) => {
            // @TODO build results
            response.results.push(result);
          });
        }
        if (rawResponse.took) {
          response.took = rawResponse.took;
        }
      }
      return response;
    } catch (e) {
      return e.meta.body.error;
    }
  }
}

module.exports = new Elastic();
