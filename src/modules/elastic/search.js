require('../env');
const taxons = require('../../taxons');

async function search(query) {
  const t0 = Date.now();
  if (process.env.WITHOUT_ELASTIC) {
    return searchWithoutElastic.apply(this, [query]);
  }

  let searchQuery = this.buildQuery(query, 'search');

  const t1 = Date.now();

  let string = query.query ? query.query.trim() : '';

  let response = {
    page: searchQuery.page,
    page_size: searchQuery.page_size,
    query: query,
    total: 0,
    previous_page: null,
    next_page: null,
    took: 0,
    took_pre1: t1 - t0,
    took_q1: 0,
    took_pre2: 0,
    took_q2: 0,
    took_post: 0,
    max_score: 0,
    results: [],
    relaxed: false,
  };

  if (string && searchQuery.query) {
    let rawResponse = await this.client.search(searchQuery.query);
    const t2 = Date.now();
    response.took_q1 = t2 - t1;
    if (rawResponse && rawResponse.body) {
      if (!rawResponse.body.hits || !rawResponse.body.hits.total || !rawResponse.body.hits.total.value) {
        searchQuery = this.buildQuery(query, 'search', true);
        const t1b = Date.now();
        response.took_pre2 = t1b - t2;
        response.relaxed = true;
        rawResponse = await this.client.search(searchQuery.query);
        response.took_q2 = Date.now() - t1b;
      }
      const t3 = Date.now();
      if (rawResponse && rawResponse.body) {
        if (rawResponse.body.hits && rawResponse.body.hits.total && rawResponse.body.hits.total.value > 0) {
          response.total = rawResponse.body.hits.total.value;
          response.max_score = rawResponse.body.hits.max_score;
          if (searchQuery.page > 0) {
            let previous_page_params = new URLSearchParams(query);
            previous_page_params.set('page', searchQuery.page - 1);
            response.previous_page = previous_page_params.toString();
          }
          if ((searchQuery.page + 1) * searchQuery.page_size < rawResponse.body.hits.total.value) {
            let next_page_params = new URLSearchParams(query);
            next_page_params.set('page', searchQuery.page + 1);
            response.next_page = next_page_params.toString();
          }
          rawResponse.body.hits.hits.forEach((rawResult) => {
            let result = {
              score: rawResult._score ? rawResult._score / response.max_score : 0,
              highlights: {},
              id: rawResult._id,
              jurisdiction:
                query.resolve_references && taxons.jurisdiction.taxonomy[rawResult._source.jurisdiction]
                  ? taxons.jurisdiction.taxonomy[rawResult._source.jurisdiction]
                  : rawResult._source.jurisdiction,
              chamber:
                query.resolve_references && taxons.chamber.taxonomy[rawResult._source.chamber]
                  ? taxons.chamber.taxonomy[rawResult._source.chamber]
                  : rawResult._source.chamber,
              number: Array.isArray(rawResult._source.numberFull)
                ? rawResult._source.numberFull[0]
                : rawResult._source.numberFull,
              numbers: Array.isArray(rawResult._source.numberFull)
                ? rawResult._source.numberFull
                : [rawResult._source.numberFull],
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
              files: taxons.filetype.buildFilesList(rawResult._id, rawResult._source.files, query.resolve_references),
            };

            let hasHitsInSpecificZone = false;
            for (let key in searchQuery.queryField) {
              let field = searchQuery.queryField[key];
              if (rawResult.highlight && rawResult.highlight[field] && rawResult.highlight[field].length > 0) {
                if (key !== 'text' && /zone/i.test(field)) {
                  hasHitsInSpecificZone = true;
                }
                result.highlights[key] = [];
                rawResult.highlight[field].forEach(function (hit) {
                  hit = hit.replace(/^[^a-z<>]*/i, '');
                  hit = hit.replace(/[^a-z<>]*$/i, '');
                  result.highlights[key].push(hit.trim());
                });
              }
              if (
                rawResult.highlight &&
                rawResult.highlight[field + '.exact'] &&
                rawResult.highlight[field + '.exact'].length > 0
              ) {
                if (key !== 'text' && /zone/i.test(field)) {
                  hasHitsInSpecificZone = true;
                }
                result.highlights[key] = [];
                rawResult.highlight[field + '.exact'].forEach(function (hit) {
                  hit = hit.replace(/^[^a-z<>]*/i, '');
                  hit = hit.replace(/[^a-z<>]*$/i, '');
                  result.highlights[key].push(hit.trim());
                });
              }
            }

            // Don't add highlights from the whole text when some specific zones are already highlighted:
            if (hasHitsInSpecificZone === true && result.highlights['text']) {
              delete result.highlights['text'];
            }

            response.results.push(result);
          });
        }
        if (rawResponse.body.took) {
          response.took = rawResponse.body.took;
        }
      }
      response.took_post = Date.now() - t3;
    }
  }

  return response;
}

function searchWithoutElastic(query) {
  const fs = require('fs');
  const path = require('path');

  if (this.data === null) {
    this.data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_list.json')).toString());
  }

  let string = query.query ? query.query.trim() : '';
  const page = query.page || 0;
  const page_size = query.page_size || 10;

  let response = {
    page: page,
    page_size: page_size,
    query: query,
    total: query.resolve_references ? this.data.resolved.length : this.data.unresolved.length,
    previous_page: null,
    next_page: null,
    took: 42,
    max_score: 10,
    results: query.resolve_references
      ? this.data.resolved.slice(page * page_size, (page + 1) * page_size)
      : this.data.unresolved.slice(page * page_size, (page + 1) * page_size),
  };

  if (string) {
    if (page > 0) {
      let previous_page_params = new URLSearchParams(query);
      previous_page_params.set('page', page - 1);
      response.previous_page = previous_page_params.toString();
    }

    if (query.resolve_references) {
      if ((page + 1) * page_size < this.data.resolved.length) {
        let next_page_params = new URLSearchParams(query);
        next_page_params.set('page', page + 1);
        response.next_page = next_page_params.toString();
      }
    } else {
      if ((page + 1) * page_size < this.data.unresolved.length) {
        let next_page_params = new URLSearchParams(query);
        next_page_params.set('page', page + 1);
        response.next_page = next_page_params.toString();
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
      if (i % 5 === 0) {
        response.results[i].files = sample.files;
      } else {
        response.results[i].files = [];
      }
    }
  } else {
    response.total = 0;
    response.max_score = 0;
    response.results = [];
  }

  return response;
}

module.exports = search;
