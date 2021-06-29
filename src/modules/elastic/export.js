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
          let previous_batch_params = new URLSearchParams(query);
          previous_batch_params.set('batch', searchQuery.page - 1);
          response.previous_batch = previous_batch_params.toString();
        }
        if ((searchQuery.page + 1) * searchQuery.page_size < rawResponse.body.hits.total.value) {
          let next_batch_params = new URLSearchParams(query);
          next_batch_params.set('batch', searchQuery.page + 1);
          response.next_batch = next_batch_params.toString();
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
            contested: rawResult._source.contested ? rawResult._source.contested : [],
            visa: rawResult._source.visa
              ? rawResult._source.visa.map((item) => {
                  return {
                    title: item,
                  };
                })
              : [],
            rapprochements: rawResult._source.rapprochements ? rawResult._source.rapprochements : [],
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
  const fs = require('fs');
  const path = require('path');

  if (this.data === null) {
    this.data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_list.json')).toString());
  }

  let batch = query.batch || 0;
  let batch_size = query.batch_size || 10;

  let response = {
    batch: batch,
    batch_size: batch_size,
    query: query,
    total: query.resolve_references ? this.data.resolved.length : this.data.unresolved.length,
    previous_batch: null,
    next_batch: null,
    took: 42,
    results: query.resolve_references
      ? this.data.resolved.slice(batch * batch_size, (batch + 1) * batch_size)
      : this.data.unresolved.slice(batch * batch_size, (batch + 1) * batch_size),
  };

  if (batch > 0) {
    let previous_batch_params = new URLSearchParams(query);
    previous_batch_params.set('batch', batch - 1);
    response.previous_batch = previous_batch_params.toString();
  }

  if (query.resolve_references) {
    if ((batch + 1) * batch_size < this.data.resolved.length) {
      let next_batch_params = new URLSearchParams(query);
      next_batch_params.set('batch', batch + 1);
      response.next_batch = next_batch_params.toString();
    }
  } else {
    if ((batch + 1) * batch_size < this.data.unresolved.length) {
      let next_batch_params = new URLSearchParams(query);
      next_batch_params.set('batch', batch + 1);
      response.next_batch = next_batch_params.toString();
    }
  }

  let sample = null;

  if (query.resolve_references) {
    sample = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_detail_resolved.json')).toString(),
    );
  } else {
    sample = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_detail_unresolved.json')).toString(),
    );
  }

  for (let i = 0; i < response.results.length; i++) {
    delete response.results[i].score;
    delete response.results[i].highlights;
    response.results[i].source = sample.source;
    response.results[i].text = sample.text;
    response.results[i].solution_alt = sample.solution_alt;
    response.results[i].update_date = sample.update_date;
    response.results[i].bulletin = sample.bulletin;
    response.results[i].files = sample.files;
    response.results[i].zones = sample.zones;
    response.results[i].contested = sample.contested;
    response.results[i].visa = sample.visa;
    response.results[i].rapprochements = sample.rapprochements;
  }

  return response;
}

module.exports = batchexport;
