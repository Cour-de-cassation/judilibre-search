require('../env');
const taxons = require('../../taxons');

async function search(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return searchWithoutElastic.apply(this, [query]);
  }

  let searchQuery = this.buildQuery(query, 'search');

  let string = query.query ? query.query.trim() : '';

  let response = {
    page: searchQuery.page,
    page_size: searchQuery.page_size,
    query: query,
    total: 0,
    previous_page: null,
    next_page: null,
    took: 0,
    max_score: 0,
    results: [],
    relaxed: false,
  };

  if (string && searchQuery.query) {
    if (process.env.API_VERBOSITY === 'debug') {
      response.searchQuery = searchQuery.query;
    }

    let rawResponse = await this.client.search(searchQuery.query);
    if (rawResponse && rawResponse.body) {
      if (!rawResponse.body.hits || !rawResponse.body.hits.total || !rawResponse.body.hits.total.value) {
        searchQuery = this.buildQuery(query, 'search', true);
        response.relaxed = true;
        rawResponse = await this.client.search(searchQuery.query);
      }
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
            rawResult._source.publication = rawResult._source.publication.filter((item) => {
              return /[br]/i.test(item);
            });

            let taxonFilter = rawResult._source.jurisdiction;

            let result = {
              score: rawResult._score ? rawResult._score / response.max_score : 0,
              highlights: {},
              id: rawResult._id,
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
            };

            if (rawResult._source.jurisdiction === 'cc') {
              result.number = formatPourvoiNumber(result.number);
              result.numbers = result.numbers.map(formatPourvoiNumber);
            }

            if (result.type === 'undefined') {
              delete result.type;
            }

            let hasHitsInSpecificZone = false;
            for (let key in searchQuery.queryField) {
              let field = searchQuery.queryField[key];
              if (rawResult.highlight && rawResult.highlight[field] && rawResult.highlight[field].length > 0) {
                if (key !== 'text' && /zone/i.test(field)) {
                  hasHitsInSpecificZone = true;
                }
                result.highlights[key] = [];
                rawResult.highlight[field].forEach(function (hit) {
                  hit = hit.replace(/^[^a-z<>]*/gim, '');
                  hit = hit.replace(/[^a-z<>]*$/gim, '');
                  hit = hit.replace(/X+/gm, '…');
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
                  hit = hit.replace(/^[^a-z<>]*/gim, '');
                  hit = hit.replace(/[^a-z<>]*$/gim, '');
                  hit = hit.replace(/X+/gm, '…');
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
    }
  }

  return response;
}

function formatPourvoiNumber(str) {
  str = `${str}`.trim();
  if (/^\d{2}\D\d{2}\D\d{3}$/.test(str) === false) {
    str = str.replace(/\D/gim, '').trim();
    str = `${str.substring(0, 2)}-${str.substring(2, 4)}.${str.substring(4)}`;
  }
  return str;
}

function searchWithoutElastic(query) {
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
    relaxed: false,
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

    for (let i = 0; i < response.results.length; i++) {
      if (Array.isArray(response.results[i].number)) {
        response.results[i].numbers = response.results[i].number;
        response.results[i].number = response.results[i].number[0];
      } else {
        response.results[i].numbers = [response.results[i].number];
      }

      response.results[i].files = taxons[taxonFilter].filetype.buildFilesList(
        response.results[i].id,
        response.results[i].files,
        query.resolve_references,
      );
    }
  } else {
    response.total = 0;
    response.max_score = 0;
    response.results = [];
  }

  return response;
}

module.exports = search;
