require('../env');
const taxons = require('../../taxons');
const {
  formatNumber,
  formatNumbers,
  formatChamber,
  formatJurisdiction,
  formatFormation,
  formatLocation,
  formatPublication,
  formatSolution,
  formatQueryToUrlParams,
} = require('./utils/format');
const { getPages } = require('./utils/pagination');

const {
  filterByFunctionsScore,
  sort,
  buildFilter,
  filterByEcli,
  filterByPourvoi,
  filterByPublication,
  filterByChamber,
  filterByFormation,
  filterByType,
  filterBySolution,
  filterByJurisdiction,
  filterByLocation,
  filterByTheme,
  filterByWithFileOfType,
  filterByParticularInterest,
  filterByDate,
} = require('./utils/query');

const { buildMust, filterByFreeTextTheme, filterByFreeText } = require('./utils/query/filtersFreeText');

function buildSearchQuery(query) {
  const functionsScore = filterByFunctionsScore(query);
  const searchString = buildMust(query, filterByFreeTextTheme, filterByFreeText);
  const size = query.page_size || 10;
  return {
    index: process.env.ELASTIC_INDEX,
    preference: 'preventbouncingresults',
    explain: false,
    size,
    from: (query.page || 0) * size,
    _source: true,
    body: {
      track_scores: true,
      query: {
        function_score: {
          query: {
            bool: {
              filter: buildFilter(
                query,
                filterByEcli,
                filterByPourvoi,
                filterByPublication,
                filterByFormation,
                filterByChamber,
                filterByType,
                filterBySolution,
                filterByJurisdiction,
                filterByLocation,
                filterByTheme,
                filterByWithFileOfType,
                filterByParticularInterest,
                filterByDate,
              ),
              must: searchString,
            },
          },
          ...(functionsScore ? { functions: functionsScore } : {}),
        },
      },
      highlight: searchString.simple_query_string.fields.filter((_) => _ !== 'themes'),
      sort: sort(query),
    },
  };
}

function formatDecisionToResponse(rawResult, query) {
  const result = rawResult._source;
  const publication = result.publication?.filter(/[br]/i.test) ?? [];

  return {
    id: rawResult._id,
    jurisdiction: formatJurisdiction(result, query),
    chamber: formatChamber(result, query),
    number: formatNumber(result),
    numbers: formatNumbers(result),
    ecli: result.ecli,
    formation: formatFormation(result, query),
    location: formatLocation(result, query),
    publication: formatPublication({ ...result, publication }, query),
    decision_date: result.decision_date,
    solution: formatSolution(result, query),
    solution_alt: result.solution_alt,
    ...(result.type === undefined ? {} : { type: formatType(result, query) }),
    summary: result.summary,
    themes: result.themes,
    nac: result.nac ? result.nac : null,
    portalis: result.portalis ? result.portalis : null,
    bulletin: result.bulletin,
    files: formatFiles(rawResult._id, result, query),
    titlesAndSummaries: result.titlesAndSummaries ? result.titlesAndSummaries : [],
    particularInterest: result.particularInterest === true,
  };
}

async function getSafeSearch(searchQuery, repeated = false) {
  if (repeated)
    searchQuery.body.query.function_score.query.bool.must.simple_query_string = {
      ...searchQuery.body.query.function_score.query.bool.must.simple_query_string,
      default_operator: 'or',
      auto_generate_synonyms_phrase_query: true,
      fuzzy_max_expansions: 50,
      fuzzy_transpositions: true,
    };

  const resultSearch = await this.client.search(searchQuery);
  const resultCount = await this.client.count({
    index: searchQuery.index,
    body: { query: searchQuery.body.query },
  });

  if (resultSearch.body.hits.hits.length <= 0 && !repeated) return getSafeSearch(searchQuery, repeated = true);
  return { resultSearch, resultCount, repeated };
}

async function search(query) {
  if (process.env.WITHOUT_ELASTIC) {
    return searchWithoutElastic.apply(this, [query]);
  }

  const searchQuery = buildSearchQuery(query);
  const hasSearchString = searchQuery.body.query.function_score.query.bool.must.simple_query_string.query.length > 0;

  if (!hasSearchString)
    return {
      page: searchQuery.page,
      page_size: searchQuery.size,
      query: query,
      total: 0,
      previous_page: null,
      next_page: null,
      took: 0,
      max_score: 0,
      results: [],
      relaxed: false,
      searchQuery,
      date: new Date(),
    };

  const { resultSearch, resultCount, repeated } = await getSafeSearch(searchQuery);
  const responses = resultSearch.body.hits.hits ?? [];
  const total = resultCount?.body?.count ?? rawResponse.body.hits.total.value;
  const { pageBefore, pageAfter } = getPages(searchQuery.page, searchQuery.size, total);

  return {
    page: searchQuery.page,
    page_size: searchQuery.size,
    query: query,
    total,
    previous_page: formatQueryToUrlParams({ ...query, page: pageBefore }),
    next_page: formatQueryToUrlParams({ ...query, page: pageAfter }),
    took: resultSearch.body.took,
    max_score: resultSearch.body.hits.max_score,
    results: responses.map((_) => ({
      ...formatDecisionToResponse(_, query),
      score: _._score ? _._score / resultSearch.body.hits.max_score : 0,
      highlights: formatHighlights(_.highlight, searchQuery.queryField),
    })),
    relaxed: repeated,
    searchQuery,
    date: new Date(),
  };
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
  } else if (taxonFilter === 'tj') {
    this.data = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tj', 'sample_list.json')).toString(),
    );
  } else if (taxonFilter === 'tcom') {
    this.data = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tcom', 'sample_list.json')).toString(),
    );
  } else if (taxonFilter === 'all') {
    this.data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'sample_list.json')).toString());
    const additionalData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'ca', 'sample_list.json')).toString(),
    );
    this.data.resolved = this.data.resolved.concat(additionalData.resolved);
    this.data.unresolved = this.data.unresolved.concat(additionalData.unresolved);
    const additionalData2 = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tj', 'sample_list.json')).toString(),
    );
    this.data.resolved = this.data.resolved.concat(additionalData2.resolved);
    this.data.unresolved = this.data.unresolved.concat(additionalData2.unresolved);
    const additionalData3 = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'tcom', 'sample_list.json')).toString(),
    );
    this.data.resolved = this.data.resolved.concat(additionalData3.resolved);
    this.data.unresolved = this.data.unresolved.concat(additionalData3.unresolved);
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

  if (query.particularInterest) {
    this.data.resolved = this.data.resolved.filter((item) => {
      item.particularInterest === true;
    });
    this.data.unresolved = this.data.unresolved.filter((item) => {
      item.particularInterest === true;
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

      try {
        response.results[i].files = taxons[taxonFilter].filetype.buildFilesList(
          response.results[i].id,
          response.results[i].files,
          query.resolve_references,
        );
      } catch (_ignore) {
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
