require('./env');
const taxons = require('../taxons');

class Elastic {
  constructor() {
    if (process.env.WITHOUT_ELASTIC) {
      this.data = null;
    } else {
      const { Client } = require('@elastic/elasticsearch');
      this.client = new Client({ node: `http://${process.env.ELASTIC_NODE}` });
    }
  }

  buildQuery(query, forDecision) {
    let page = query.page || 0;
    let page_size = query.page_size || 10;
    let string = query.query || '';
    let splitString = string.trim().split(/[\s,;/?!]+/gm);
    let searchQuery;
    let textFields = [];
    const queryField = {
      expose: 'zoneExpose',
      moyens: 'zoneMoyens',
      motivations: 'zoneMotivations',
      dispositif: 'zoneDispositif',
      annexes: 'zoneAnnexes',
      visa: 'visa', // handled separately
    };

    // Detect some special data in query string:
    let searchString = [];
    let searchECLI = [];
    let searchPourvoiNumber = [];
    let searchVisa = false;

    if (/articles?\s+.*\d/i.test(string)) {
      searchVisa = true;
    }

    for (let i = 0; i < splitString.length; i++) {
      if (/^ecli:\w+:\w+:\d+:[a-z0-9.]+$/i.test(splitString[i])) {
        searchECLI.push(splitString[i]);
      } else if (/^\d\d[^\w\d]\d\d[^\w\d]\d\d\d$/.test(splitString[i])) {
        searchPourvoiNumber.push(splitString[i].replace(/[^\w\d]/gm, ''));
      } else {
        searchString.push(splitString[i]);
      }
    }

    if (forDecision !== true) {
      // Base query for regular search:
      searchQuery = {
        index: process.env.ELASTIC_INDEX,
        explain: false,
        from: page * page_size,
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
                      publication: 'b',
                    },
                  },
                  weight: 10,
                },
                {
                  filter: {
                    match: {
                      publication: 'r',
                    },
                  },
                  weight: 10,
                },
                {
                  filter: {
                    match: {
                      publication: 'c',
                    },
                  },
                  weight: 5,
                },
                {
                  filter: {
                    match: {
                      publication: 'l',
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

      // ECLI:
      if (searchECLI.length > 0) {
        if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
          searchQuery.body.query.function_score.query.bool.filter = [];
        }
        searchQuery.body.query.function_score.query.bool.filter.push({
          terms: {
            ecli: searchECLI,
          },
        });
      }

      // "Pourvoi" number:
      if (searchPourvoiNumber.length > 0) {
        if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
          searchQuery.body.query.function_score.query.bool.filter = [];
        }
        searchQuery.body.query.function_score.query.bool.filter.push({
          terms: {
            number: searchPourvoiNumber,
          },
        });
      }

      // Publication:
      if (query.publication && Array.isArray(query.publication) && query.publication.length > 0) {
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
      if (query.formation && Array.isArray(query.formation) && query.formation.length > 0) {
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
      if (query.chamber && Array.isArray(query.chamber) && query.chamber.length > 0) {
        if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
          searchQuery.body.query.function_score.query.bool.filter = [];
        }
        searchQuery.body.query.function_score.query.bool.filter.push({
          terms: {
            chamber: query.chamber,
          },
        });
      }

      // Type:
      if (query.type && Array.isArray(query.type) && query.type.length > 0) {
        if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
          searchQuery.body.query.function_score.query.bool.filter = [];
        }
        searchQuery.body.query.function_score.query.bool.filter.push({
          terms: {
            type: query.type,
          },
        });
      }

      // Solution:
      if (query.solution && Array.isArray(query.solution) && query.solution.length > 0) {
        if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
          searchQuery.body.query.function_score.query.bool.filter = [];
        }
        searchQuery.body.query.function_score.query.bool.filter.push({
          terms: {
            solution: query.solution,
          },
        });
      }

      // Jurisdiction:
      if (query.jurisdiction && Array.isArray(query.jurisdiction) && query.jurisdiction.length > 0) {
        if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
          searchQuery.body.query.function_score.query.bool.filter = [];
        }
        searchQuery.body.query.function_score.query.bool.filter.push({
          terms: {
            jurisdiction: query.jurisdiction,
          },
        });
      }

      // Committee:
      if (query.committee && Array.isArray(query.committee) && query.committee.length > 0) {
        if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
          searchQuery.body.query.function_score.query.bool.filter = [];
        }
        searchQuery.body.query.function_score.query.bool.filter.push({
          terms: {
            committee: query.committee,
          },
        });
      }

      // Themes:
      if (query.theme && Array.isArray(query.theme) && query.theme.length > 0) {
        if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
          searchQuery.body.query.function_score.query.bool.filter = [];
        }
        searchQuery.body.query.function_score.query.bool.filter.push({
          terms: {
            themes: query.theme,
          },
        });
      }

      // Date start/end
      if (query.date_start || query.date_end) {
        if (searchQuery.body.query.function_score.query.bool.filter === undefined) {
          searchQuery.body.query.function_score.query.bool.filter = [];
        }
        let range = {
          range: {
            decision_date: {
              boost: 10,
            },
          },
        };
        if (query.date_start) {
          range.range.decision_date.gte = query.date_start;
        }
        if (query.date_end) {
          range.range.decision_date.lte = query.date_end;
        }
        searchQuery.body.query.function_score.query.bool.filter.push(range);
      }

      // Specific text fields to target:
      if (query.field && Array.isArray(query.field) && query.field.length > 0) {
        query.field.forEach((field) => {
          if (queryField[field] && textFields.indexOf(queryField[field]) === -1) {
            textFields.push(queryField[field]);
          }
        });
      } else {
        if (query.operator && query.operator === 'exact') {
          textFields.push('textExact');
        } else {
          textFields.push('text');
        }
      }

      // Boosts text fields:
      let boostedFields = [];
      for (let i = 0; i < textFields.length; i++) {
        if (textFields[i] === 'zoneMotivations' || textFields[i] === 'zoneDispositif') {
          boostedFields[i] = textFields[i] + '^5';
        } else {
          boostedFields[i] = textFields[i];
        }
      }

      // Finalize:
      if (searchString.length > 0) {
        if (query.operator !== 'exact') {
          searchQuery.body.query.function_score.query.bool.must = {
            multi_match: {
              query: searchString.join(' '),
              fields: boostedFields,
              operator: query.operator ? query.operator.toUpperCase() : taxons.operator.default.toUpperCase(),
              type: 'cross_fields',
            },
          };
        } else {
          // @FIXME still a little bit fuzzy...
          searchQuery.body.query.function_score.query.bool.must = {
            match_phrase: {
              textExact: {
                query: string,
              },
            },
          };
        }
      }

      // Highlight all text fields:
      textFields.forEach((field) => {
        searchQuery.body.highlight.fields[field] = {};
      });

      // Visa:
      if (searchVisa === true) {
        if (searchQuery.body.query.function_score.query.bool.must === undefined) {
          searchQuery.body.query.function_score.query.bool.must = {
            multi_match: {
              query: searchString.join(' '),
              fields: ['visa'],
              operator: query.operator ? query.operator.toUpperCase() : taxons.operator.default.toUpperCase(),
              type: 'cross_fields',
            },
          };
        } else {
          searchQuery.body.query.function_score.query.bool.must.multi_match.fields.push('visa^10');
        }
        searchQuery.body.highlight.fields['visa'] = {};
      }
    } else {
      // Base query for single decision highlighting:
      searchQuery = {
        index: process.env.ELASTIC_INDEX,
        explain: false,
        from: 0,
        size: 1,
        _source: false,
        body: {
          query: {
            function_score: {
              query: {
                bool: {
                  filter: [
                    {
                      ids: {
                        values: [query.id],
                      },
                    },
                  ],
                },
              },
            },
          },
          highlight: {
            fields: {},
          },
        },
      };

      // Finalize:
      if (searchString.length > 0) {
        if (query.operator !== 'exact') {
          searchQuery.body.query.function_score.query.bool.must = {
            multi_match: {
              query: searchString.join(' '),
              fields: ['text'],
              operator: query.operator ? query.operator.toUpperCase() : taxons.operator.default.toUpperCase(),
              type: 'cross_fields',
            },
          };
          searchQuery.body.highlight.fields.text = {
            number_of_fragments: 0,
          };
        } else {
          // @FIXME still a little bit fuzzy...
          searchQuery.body.query.function_score.query.bool.must = {
            match_phrase: {
              textExact: {
                query: string,
              },
            },
          };
          searchQuery.body.highlight.fields.textExact = {
            number_of_fragments: 0,
          };
        }
      }
    }

    return {
      page: page,
      page_size: page_size,
      queryField: queryField,
      textFields: textFields,
      query: searchQuery,
    };
  }

  serialize(obj) {
    let str = [];
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  }

  async search(query) {
    if (process.env.WITHOUT_ELASTIC) {
      return this.searchWithoutElastic(query);
    }

    const searchQuery = this.buildQuery(query, false);

    const rawResponse = await this.client.search(searchQuery.query);
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
    };
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
          };

          let hasHit = false;
          for (let key in searchQuery.queryField) {
            let field = searchQuery.queryField[key];
            if (rawResult.highlight && rawResult.highlight[field] && rawResult.highlight[field].length > 0) {
              result.highlights[key] = [];
              rawResult.highlight[field].forEach(function (hit) {
                hit = hit.replace(/^[^a-z<>]*/i, '');
                hit = hit.replace(/[^a-z<>]*$/i, '');
                result.highlights[key].push(hit.trim());
                hasHit = true;
              });
            }
          }

          if (rawResult.highlight && hasHit === false) {
            if (
              searchQuery.textFields.indexOf('text') !== -1 &&
              rawResult.highlight['text'] &&
              rawResult.highlight['text'].length > 0
            ) {
              result.highlights['text'] = [];
              rawResult.highlight['text'].forEach(function (hit) {
                hit = hit.replace(/^[^a-z<>]*/i, '');
                hit = hit.replace(/[^a-z<>]*$/i, '');
                result.highlights['text'].push(hit.trim());
              });
            } else if (
              searchQuery.textFields.indexOf('textExact') !== -1 &&
              rawResult.highlight['textExact'] &&
              rawResult.highlight['textExact'].length > 0
            ) {
              result.highlights['text'] = [];
              rawResult.highlight['textExact'].forEach(function (hit) {
                hit = hit.replace(/^[^a-z<>]*/i, '');
                hit = hit.replace(/[^a-z<>]*$/i, '');
                result.highlights['text'].push(hit.trim());
              });
            }
          }

          response.results.push(result);
        });
      }
      if (rawResponse.body.took) {
        response.took = rawResponse.body.took;
      }
    }
    return response;
  }

  searchWithoutElastic(query) {
    const fs = require('fs');
    const path = require('path');

    if (this.data === null) {
      this.data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'sample_list.json')).toString());
    }

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

    return response;
  }

  async decision(query) {
    if (process.env.WITHOUT_ELASTIC) {
      return this.decisionWithoutElastic(query);
    }

    let rawResponse;
    let response = null;

    try {
      rawResponse = await this.client.get({
        id: query.id,
        index: process.env.ELASTIC_INDEX,
        _source: true,
      });
    } catch (e) {
      rawResponse = null;
    }

    if (rawResponse && rawResponse.body && rawResponse.body.found) {
      let highlightedText = null;

      if (query.query) {
        // Actual search query is required for hightlighting:
        // @TODO zoning
        const searchQuery = this.buildQuery(query, true);
        const queryResponse = await this.client.search(searchQuery.query);
        if (
          queryResponse &&
          queryResponse.body &&
          queryResponse.body.hits &&
          queryResponse.body.hits.hits &&
          queryResponse.body.hits.hits.length > 0 &&
          queryResponse.body.hits.hits[0].highlight
        ) {
          if (
            queryResponse.body.hits.hits[0].highlight.text &&
            queryResponse.body.hits.hits[0].highlight.text.length > 0
          ) {
            highlightedText = queryResponse.body.hits.hits[0].highlight.text[0];
          } else if (
            queryResponse.body.hits.hits[0].highlight.textExact &&
            queryResponse.body.hits.hits[0].highlight.textExact.length > 0
          ) {
            highlightedText = queryResponse.body.hits.hits[0].highlight.textExact[0];
          }
        }
      }

      let rawResult = rawResponse.body;
      response = {
        id: rawResult._id,
        source: rawResult._source.source,
        text: highlightedText ? highlightedText : rawResult._source.text,
        chamber:
          query.resolve_references && taxons.chamber.taxonomy[rawResult._source.chamber]
            ? taxons.chamber.taxonomy[rawResult._source.chamber]
            : rawResult._source.chamber,
        decision_date: rawResult._source.decision_date,
        ecli: rawResult._source.ecli,
        jurisdiction:
          query.resolve_references && taxons.jurisdiction.taxonomy[rawResult._source.jurisdiction]
            ? taxons.jurisdiction.taxonomy[rawResult._source.jurisdiction]
            : rawResult._source.jurisdiction,
        number: rawResult._source.numberFull,
        publication: query.resolve_references
          ? rawResult._source.publication.map((key) => {
              if (taxons.publication.taxonomy[key]) {
                return taxons.publication.taxonomy[key];
              }
              return key;
            })
          : rawResult._source.publication,
        solution:
          query.resolve_references && taxons.solution.taxonomy[rawResult._source.solution]
            ? taxons.solution.taxonomy[rawResult._source.solution]
            : rawResult._source.solution,
        solution_alt: rawResult._source.solution_alt,
        type:
          query.resolve_references && taxons.type.taxonomy[rawResult._source.type]
            ? taxons.type.taxonomy[rawResult._source.type]
            : rawResult._source.type,
        formation:
          query.resolve_references && taxons.formation.taxonomy[rawResult._source.formation]
            ? taxons.formation.taxonomy[rawResult._source.formation]
            : rawResult._source.formation,
        update_date: rawResult._source.update_date,
        summary: rawResult._source.summary,
        themes: rawResult._source.themes,
        bulletin: rawResult._source.bulletin,
        files: rawResult._source.files,
        zones: rawResult._source.zones,
        visa: rawResult._source.visa,
        rapprochements: rawResult._source.rapprochements,
      };
    }

    return response;
  }

  decisionWithoutElastic(query) {
    const fs = require('fs');
    const path = require('path');

    let response = null;

    if (query.resolve_references) {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', 'data', 'sample_detail_resolved.json')).toString(),
      );
    } else {
      response = JSON.parse(
        fs.readFileSync(path.join(__dirname, '..', 'data', 'sample_detail_unresolved.json')).toString(),
      );
    }

    response.id = query.id;

    return response;
  }
}

module.exports = new Elastic();
