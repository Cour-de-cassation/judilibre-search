require('./env');
const { Client } = require('@elastic/elasticsearch');
const taxons = require('../taxons');

class Elastic {
  constructor() {
    this.client = new Client({ node: `http://${process.env.ELASTIC_NODE}` });
  }

  async search(query) {
    const page = query.page || 0;
    const page_size = query.page_size || 10;

    // Reformat what could be pourvoi numbers:
    const searchString = query.query.trim().split(/\s+/gm);
    for (let i = 0; i < searchString.length; i++) {
      if (/^\d\d[^\w\d]\d\d[^\w\d]\d\d\d$/.test(searchString[i])) {
        searchString[i] = searchString[i].replace(/[^\w\d]/gm, '');
      }
    }

    // Base query:
    const searchQuery = {
      index: process.env.ELASTIC_INDEX,
      explain: false,
      from: page,
      size: page_size,
      _source: true,
      body: {
        track_scores: true,
        query: {
          function_score: {
            query: {
              bool: {},
            },
            boost: 5,
            functions: [
              {
                filter: {
                  match: {
                    publication: 'p',
                  },
                },
                weight: 10,
              },
              {
                filter: {
                  match: {
                    publication: 'd',
                  },
                },
                weight: 5,
              },
              {
                filter: {
                  match: {
                    publication: 'n',
                  },
                },
                weight: 1,
              },
            ],
            score_mode: 'max',
            boost_mode: 'multiply',
          },
        },
        sort: [
          {
            _score: 'desc',
          },
        ],
        highlight: {
          fields: {},
        },
      },
    };

    // Sort and order:
    if (query.sort && query.order) {
      searchQuery.body.sort[0] = {};
      searchQuery.body.sort[0][query.sort] = query.order;
    }

    // Publication:
    if (query.publication) {
      if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
        searchQuery.body.query.function_score.query.bool.filter = [];
      }
      searchQuery.body.query.function_score.query.bool.filter.push({
        terms: {
          publication: query.publication,
        },
      });
    }

    // Formation:
    if (query.formation) {
      if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
        searchQuery.body.query.function_score.query.bool.filter = [];
      }
      searchQuery.body.query.function_score.query.bool.filter.push({
        terms: {
          formation: query.formation,
        },
      });
    }

    // Chamber:
    if (query.chamber) {
      if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
        searchQuery.body.query.function_score.query.bool.filter = [];
      }
      searchQuery.body.query.function_score.query.bool.filter.push({
        terms: {
          chamber: query.chamber,
        },
      });
    }

    // Fields:
    const fields = [];
    const queryField = {
      expose: 'zoneExpose',
      moyens: 'zoneMoyens',
      motivations: 'zoneMotivations',
      dispositif: 'zoneDispositif',
      annexes: 'zoneAnnexes',
      number: 'number',
      // @TODO visa: 'visa',
      summary: 'summary',
      themes: 'themes',
    };
    if (query.field) {
      query.field.forEach((field) => {
        if (queryField[field]) {
          fields.push(queryField[field]);
        }
      });
    }
    if (fields.length === 0) {
      // @TODO % operator exact --> textExact
      fields.push('text');
    }

    // Boosts:
    const boostedFields = [];
    for (let i = 0; i < fields.length; i++) {
      // @ TODO add visa, etc.
      if (fields[i] === 'number') {
        boostedFields[i] = fields[i] + '^100';
      } else if (fields[i] === 'motivations' || fields[i] === 'dispositif') {
        boostedFields[i] = fields[i] + '^5';
      } else {
        boostedFields[i] = fields[i];
      }
    }

    // Finalize:
    searchQuery.body.query.function_score.query.bool.must = {
      multi_match: {
        query: searchString.join(' '),
        fields: boostedFields,
        operator: query.operator ? query.operator : taxons.operator.default,
        type: 'cross_fields',
      },
    };

    // Highlight all fields but...
    fields.forEach((field) => {
      if (field !== 'number') {
        query.body.highlight.fields[field] = {};
      }
    });

    try {
      const rawResponse = await this.client.search(searchQuery);
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
          rawResponse.hits.hits.forEach((rawResult) => {
            const result = {
              score: rawResult._score ? rawResult._score / response.max_score : 0,
              highlights: {},
              id: rawResult._source.id,
              jurisdiction: query.resolve_references
                ? taxons.jurisdiction.taxonomy[rawResult._source.jurisdiction]
                : rawResult._source.jurisdiction,
              chamber: query.resolve_references
                ? taxons.chamber.taxonomy[rawResult._source.chamber]
                : rawResult._source.chamber,
              number: rawResult._source.numberFull,
              ecli: rawResult._source.ecli,
              formation: query.resolve_references
                ? taxons.formation.taxonomy[rawResult._source.formation]
                : rawResult._source.formation,
              publication: query.resolve_references
                ? rawResult._source.publication.map((key) => {
                    return taxons.publication.taxonomy[key];
                  })
                : rawResult._source.publication,
              decision_date: rawResult._source.decision_date,
              solution: query.resolve_references
                ? taxons.solution.taxonomy[rawResult._source.solution]
                : rawResult._source.solution,
              solution_alt: rawResult._source.solution_alt,
              summary: rawResult._source.summary,
              themes: rawResult._source.themes,
              bulletin: rawResult._source.bulletin,
              files: rawResult._source.files,
            };

            taxons.field.keys.forEach((field) => {
              if (rawResult.highlight[field] && rawResult.highlight[field].length > 0) {
                result.highlights[field] = [];
                rawResult.highlight[field].forEach(function (hit) {
                  hit = hit.replace(/^[^a-z<>]*/i, '');
                  hit = hit.replace(/[^a-z<>]*$/i, '');
                  result.highlights[field].push(hit.trim());
                });
              }
            });

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
