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
          let taxonFilter = rawResult._source.jurisdiction;

          let result = {
            id: rawResult._id,
            source: rawResult._source.source,
            text: rawResult._source.displayText,
            jurisdiction:
              query.resolve_references && taxons[taxonFilter].jurisdiction.taxonomy[rawResult._source.jurisdiction]
                ? taxons[taxonFilter].jurisdiction.taxonomy[rawResult._source.jurisdiction]
                : rawResult._source.jurisdiction,
            chamber:
              query.resolve_references && taxons[taxonFilter].chamber.taxonomy[rawResult._source.chamber]
                ? taxons[taxonFilter].chamber.taxonomy[rawResult._source.chamber]
                : rawResult._source.chamber,
            number: Array.isArray(rawResult._source.numberFull)
              ? rawResult._source.numberFull[0]
              : rawResult._source.numberFull,
            numbers: Array.isArray(rawResult._source.numberFull)
              ? rawResult._source.numberFull
              : [rawResult._source.numberFull],
            ecli: rawResult._source.ecli,
            formation:
              query.resolve_references && taxons[taxonFilter].formation.taxonomy[rawResult._source.formation]
                ? taxons[taxonFilter].formation.taxonomy[rawResult._source.formation]
                : rawResult._source.formation,
            location:
              query.resolve_references && taxons[taxonFilter].location.taxonomy[rawResult._source.location]
                ? taxons[taxonFilter].location.taxonomy[rawResult._source.location]
                : rawResult._source.location,
            publication: query.resolve_references
              ? rawResult._source.publication.map((key) => {
                  if (taxons[taxonFilter].publication.taxonomy[key]) {
                    return taxons[taxonFilter].publication.taxonomy[key];
                  }
                  return key;
                })
              : rawResult._source.publication,
            decision_date: rawResult._source.decision_date,
            update_date: rawResult._source.update_date,
            solution:
              query.resolve_references && taxons[taxonFilter].solution.taxonomy[rawResult._source.solution]
                ? taxons[taxonFilter].solution.taxonomy[rawResult._source.solution]
                : rawResult._source.solution,
            solution_alt: rawResult._source.solution_alt,
            type:
              query.resolve_references && taxons[taxonFilter].type.taxonomy[rawResult._source.type]
                ? taxons[taxonFilter].type.taxonomy[rawResult._source.type]
                : rawResult._source.type,
            summary: rawResult._source.summary,
            themes: rawResult._source.themes,
            bulletin: rawResult._source.bulletin,
            files: taxons[taxonFilter].filetype.buildFilesList(
              rawResult._id,
              rawResult._source.files,
              query.resolve_references,
            ),
            zones: rawResult._source.zones,
            contested: rawResult._source.contested ? rawResult._source.contested : null,
            visa: rawResult._source.visa
              ? rawResult._source.visa.map((item) => {
                  return {
                    title: item,
                  };
                })
              : [],
            rapprochements:
              rawResult._source.rapprochements && rawResult._source.rapprochements.value
                ? rawResult._source.rapprochements.value
                : [],
          };
          if (query.abridged) {
            delete result.source;
            delete result.text;
            delete result.update_date;
            delete result.zones;
            delete result.contested;
            delete result.visa;
            delete result.rapprochements;
          }
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

  let taxonFilter = 'cc';
  if (query.jurisdiction && Array.isArray(query.jurisdiction) && query.jurisdiction.length > 0) {
    if (query.jurisdiction.length === 1) {
      taxonFilter = query.jurisdiction[0];
    } else {
      taxonFilter = 'all';
    }
  } else {
    taxonFilter = 'cc';
  }

  if (taxonFilter === 'cc') {
    this.data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_list.json')).toString());
  } else if (taxonFilter === 'ca') {
    this.data = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'ca', 'sample_list.json')).toString(),
    );
  } else if (taxonFilter === 'all') {
    this.data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_list.json')).toString());
    const additionalData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'ca', 'sample_list.json')).toString(),
    );
    this.data.resolved = this.data.resolved.concat(additionalData.resolved);
    this.data.unresolved = this.data.unresolved.concat(additionalData.unresolved);
    this.data.resolved.sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      }
      if (a.score < b.score) {
        return 1;
      }
      return 0;
    });
    this.data.unresolved.sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      }
      if (a.score < b.score) {
        return 1;
      }
      return 0;
    });
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

  for (let i = 0; i < response.results.length; i++) {
    if (response.results[i].jurisdiction === 'cc' || response.results[i].jurisdiction === 'Cour de cassation') {
      if (query.resolve_references) {
        sample = JSON.parse(
          fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_detail_resolved.json')).toString(),
        );
      } else {
        sample = JSON.parse(
          fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_detail_unresolved.json')).toString(),
        );
      }
    } else if (response.results[i].jurisdiction === 'ca' || response.results[i].jurisdiction === "Cour d'appel") {
      if (query.resolve_references) {
        sample = JSON.parse(
          fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'ca', 'sample_detail_resolved.json')).toString(),
        );
      } else {
        sample = JSON.parse(
          fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'ca', 'sample_detail_unresolved.json')).toString(),
        );
      }
    }

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
    response.results[i].location = sample.location;
    response.results[i].nac = sample.nac;
  }

  return response;
}

module.exports = batchexport;
