require('../env');
const taxons = require('../../taxons');

async function batchexport(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return exportWithoutElastic.apply(this, [query]);
  }

  const searchQuery = this.buildQuery(query, 'export');

  let response = {
    batch: searchQuery.page,
    batch_size: searchQuery.page_size,
    query: query,
    total: 0,
    previous_batch: null,
    next_batch: null,
    took: 0,
    results: [],
  };

  if (searchQuery.query) {
    const rawResponse = await this.client.search(searchQuery.query);
    if (rawResponse && rawResponse.body) {
      if (rawResponse.body.hits && rawResponse.body.hits.total && rawResponse.body.hits.total.value > 0) {
        response.total = rawResponse.body.hits.total.value;
        if (searchQuery.page > 0) {
          let previous_page_params = new URLSearchParams(query);
          previous_page_params.set('batch', searchQuery.page - 1);
          response.previous_batch = previous_page_params.toString();
        }
        if ((searchQuery.page + 1) * searchQuery.page_size < rawResponse.body.hits.total.value) {
          let next_page_params = new URLSearchParams(query);
          next_page_params.set('batch', searchQuery.page + 1);
          response.next_batch = next_page_params.toString();
        }
        rawResponse.body.hits.hits.forEach((rawResult) => {
          let result = {
            id: rawResult._id,
            source: rawResult._source.source,
            text: rawResult._source.text,
            jurisdiction:
              query.resolve_references && taxons.jurisdiction.taxonomy[rawResult._source.jurisdiction]
                ? taxons.jurisdiction.taxonomy[rawResult._source.jurisdiction]
                : rawResult._source.jurisdiction,
            chamber:
              query.resolve_references && taxons.chamber.taxonomy[rawResult._source.chamber]
                ? taxons.chamber.taxonomy[rawResult._source.chamber]
                : rawResult._source.chamber,
            number: rawResult._source.numberFull,
            ecli: rawResult._source.ecli,
            formation:
              query.resolve_references && taxons.formation.taxonomy[rawResult._source.formation]
                ? taxons.formation.taxonomy[rawResult._source.formation]
                : rawResult._source.formation,
            publication: query.resolve_references
              ? rawResult._source.publication.map((key) => {
                  if (taxons.publication.taxonomy[key]) {
                    return taxons.publication.taxonomy[key];
                  }
                  return key;
                })
              : rawResult._source.publication,
            decision_date: rawResult._source.decision_date,
            update_date: rawResult._source.update_date,
            solution:
              query.resolve_references && taxons.solution.taxonomy[rawResult._source.solution]
                ? taxons.solution.taxonomy[rawResult._source.solution]
                : rawResult._source.solution,
            solution_alt: rawResult._source.solution_alt,
            type:
              query.resolve_references && taxons.type.taxonomy[rawResult._source.type]
                ? taxons.type.taxonomy[rawResult._source.type]
                : rawResult._source.type,
            summary: rawResult._source.summary,
            themes: rawResult._source.themes,
            bulletin: rawResult._source.bulletin,
            files: rawResult._source.files,
            zones: rawResult._source.zones,
            visa: rawResult._source.visa
              ? rawResult._source.visa.map((item) => {
                  return {
                    title: item,
                  };
                })
              : [],
            rapprochements: rawResult._source.rapprochements
              ? rawResult._source.rapprochements.map((item) => {
                  return {
                    title: item,
                  };
                })
              : [],
          };
          response.results.push(result);
        });
      }
      if (rawResponse.body.took) {
        response.took = rawResponse.body.took;
      }
    }
  }

  return response;
}

function exportWithoutElastic(query) {
  let batch = query.batch || 0;
  let batch_size = query.batch_size || 100;

  let response = {
    batch: batch,
    batch_size: batch_size,
    query: query,
    total: 0,
    previous_batch: null,
    next_batch: null,
    took: 0,
    results: [],
  };

  return response;
}

module.exports = batchexport;
