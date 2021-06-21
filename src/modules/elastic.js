require('./env');
const taxons = require('../taxons');

class Elastic {
  constructor() {
    if (process.env.WITHOUT_ELASTIC) {
      this.data = null;
    } else {
      const { Client } = require('@elastic/elasticsearch');
      this.client = new Client({ node: `${process.env.ELASTIC_NODE}`, ssl: { rejectUnauthorized: false } });
    }
  }

  buildQuery(query, forDecision) {
    let page = query.page || 0;
    let page_size = query.page_size || 10;
    let string = query.query || '';
    let splitString = string.trim().split(/[\s,;/?!]+/gm);
    let searchQuery;
    let textFields = [];
    let boostedFields = [];
    const queryField = {
      text: 'text',
      introduction: 'zoneIntroduction',
      expose: 'zoneExpose',
      moyens: 'zoneMoyens',
      motivations: 'zoneMotivations',
      dispositif: 'zoneDispositif',
      annexes: 'zoneAnnexes',
      visa: 'visa', // Not affected by 'exact' match
    };

    // Detect some special data in query string:
    let searchString = [];
    let searchECLI = [];
    let searchPourvoiNumber = [];
    let searchVisa = false;

    if (/article\D+\d/i.test(string)) {
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

      // ECLI (filter):
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

      // "Pourvoi" number (filter):
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

      // Publication (filter):
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

      // Formation (filter):
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

      // Chamber (filter):
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

      // Type (filter):
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

      // Solution (filter):
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

      // Jurisdiction (filter):
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

      // Committee (filter):
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

      // Themes (filter):
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

      // Date start/end (filter):
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
        textFields.push('text');
      }

      if (searchVisa === true && textFields.indexOf('visa') === -1) {
        textFields.push('visa');
      }

      // Handle 'exact' match:
      if (query.operator && query.operator === 'exact') {
        textFields = textFields.map((item) => {
          if (item !== 'visa') {
            return item + '.exact';
          }
          return item;
        });
      }

      // Boosts text fields:
      boostedFields = textFields.map((item) => {
        if (item === 'visa') {
          return item + '^10';
        } else if (item.indexOf('zoneMotivations') !== -1 || item.indexOf('zoneDispositif') !== -1) {
          return item + '^5';
        }
        return item;
      });

      // Highlight text fields:
      textFields.forEach((field) => {
        searchQuery.body.highlight.fields[field] = {};
      });

      // Finalize search in  text fields:
      if (searchString.length > 0) {
        let operator = taxons.operator.default.toUpperCase();
        let fuzzy = true;
        let finalSearchString = searchString.join(' ');
        if (query.operator) {
          if (query.operator === 'exact') {
            operator = 'AND';
            fuzzy = false;
            finalSearchString = `"${finalSearchString}"`.replace(/"+/gm, '"');
          } else {
            operator = query.operator.toUpperCase();
          }
        }
        searchQuery.body.query.function_score.query.bool.must = {
          simple_query_string: {
            query: finalSearchString,
            fields: boostedFields,
            default_operator: operator,
            auto_generate_synonyms_phrase_query: fuzzy,
            fuzzy_max_expansions: fuzzy ? 50 : 0,
            fuzzy_transpositions: fuzzy,
          },
        };
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

      // Specific text fields to target:
      if (query.field && Array.isArray(query.field) && query.field.length > 0) {
        query.field.forEach((field) => {
          if (queryField[field] && textFields.indexOf(queryField[field]) === -1) {
            textFields.push(queryField[field]);
          }
        });
      } else {
        textFields.push('text');
      }

      if (searchVisa === true && textFields.indexOf('visa') === -1) {
        textFields.push('visa');
      }

      // Handle 'exact' match:
      if (query.operator && query.operator === 'exact') {
        textFields = textFields.map((item) => {
          if (item !== 'visa') {
            return item + '.exact';
          }
          return item;
        });
      }

      // Highlight text fields:
      textFields.forEach((field) => {
        searchQuery.body.highlight.fields[field] = {
          number_of_fragments: 0,
        };
      });

      // Finalize search in  text fields:
      if (searchString.length > 0) {
        let operator = taxons.operator.default.toUpperCase();
        let fuzzy = true;
        let finalSearchString = searchString.join(' ');
        if (query.operator) {
          if (query.operator === 'exact') {
            operator = 'AND';
            fuzzy = false;
            finalSearchString = `"${finalSearchString}"`.replace(/"+/gm, '"');
          } else {
            operator = query.operator.toUpperCase();
          }
        }
        searchQuery.body.query.function_score.query.bool.must = {
          simple_query_string: {
            query: finalSearchString,
            fields: textFields,
            default_operator: operator,
            auto_generate_synonyms_phrase_query: fuzzy,
            fuzzy_max_expansions: fuzzy ? 50 : 0,
            fuzzy_transpositions: fuzzy,
          },
        };
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

          for (let key in searchQuery.queryField) {
            let field = searchQuery.queryField[key];
            if (rawResult.highlight && rawResult.highlight[field] && rawResult.highlight[field].length > 0) {
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
              result.highlights[key] = [];
              rawResult.highlight[field + '.exact'].forEach(function (hit) {
                hit = hit.replace(/^[^a-z<>]*/i, '');
                hit = hit.replace(/[^a-z<>]*$/i, '');
                result.highlights[key].push(hit.trim());
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
      let rawResult = rawResponse.body;
      let highlightedText = null;
      let highlightedZoning = null;

      if (query.query) {
        // Actual search query is required for hightlighting:
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
            queryResponse.body.hits.hits[0].highlight['text'] &&
            queryResponse.body.hits.hits[0].highlight['text'].length > 0
          ) {
            highlightedText = queryResponse.body.hits.hits[0].highlight['text'][0];
          } else if (
            queryResponse.body.hits.hits[0].highlight['text.exact'] &&
            queryResponse.body.hits.hits[0].highlight['text.exact'].length > 0
          ) {
            highlightedText = queryResponse.body.hits.hits[0].highlight['text.exact'][0];
          }
          if (highlightedText !== null) {
            // Rebuild zoning to integrate highlights:
            let flattenZones = [];
            for (let zone in rawResult._source.zones) {
              rawResult._source.zones[zone].forEach((fragment) => {
                flattenZones.push({
                  zone: zone,
                  start: fragment.start,
                  end: fragment.end,
                });
              });
            }
            flattenZones.sort((a, b) => {
              if (a.start < b.start) {
                return -1;
              }
              if (a.start > b.start) {
                return 1;
              }
              return 0;
            });
            let highlightedFlattenZones = JSON.parse(JSON.stringify(flattenZones));
            for (let i = 0; i < flattenZones.length; i++) {
              let start = flattenZones[i].start;
              let end = flattenZones[i].end;
              let sourceIndex = start;
              let inTag = false;
              if (i > 0) {
                let offset = highlightedFlattenZones[i - 1].end - highlightedFlattenZones[i].start;
                highlightedFlattenZones[i].start = highlightedFlattenZones[i - 1].end;
                highlightedFlattenZones[i].end += offset;
              }
              let highlightIndex = highlightedFlattenZones[i].start;

              while (sourceIndex < end) {
                if (!inTag && rawResult._source.text[sourceIndex] === highlightedText[highlightIndex]) {
                  sourceIndex++;
                  highlightIndex++;
                } else {
                  if (inTag) {
                    if (highlightedText[highlightIndex] === '>') {
                      inTag = false;
                    }
                  } else {
                    if (highlightedText[highlightIndex] === '<') {
                      inTag = true;
                    }
                  }
                  highlightIndex++;
                  highlightedFlattenZones[i].end++;
                }
              }
            }
            highlightedZoning = {};
            highlightedFlattenZones.forEach((zone) => {
              if (highlightedZoning[zone.zone] === undefined) {
                highlightedZoning[zone.zone] = [];
              }
              highlightedZoning[zone.zone].push({
                start: zone.start,
                end: zone.end,
              });
            });
          }
        }
      }

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
        zones: highlightedZoning ? highlightedZoning : rawResult._source.zones,
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
