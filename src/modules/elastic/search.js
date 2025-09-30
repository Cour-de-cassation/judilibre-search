require('../env');
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
  const searchQuery = buildSearchQuery(query);
  const hasSearchString = searchQuery.body.query.function_score.query.bool.must.simple_query_string.query.length > 0;

  if (!hasSearchString) // is that true ?
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

module.exports = search
