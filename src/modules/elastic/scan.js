const { getCursors } = require('./utils/pagination');

const { 
  formatSearchAfterIntoUrlParams, 
  formatUrlParamsIntoSearchAfter, 
  formatType, 
  formatNumber, 
  formatNumbers, 
  formatJurisdiction, 
  formatChamber, 
  formatFormation, 
  formatLocation, 
  formatPublication, 
  formatSolution 
} = require('./utils/format');

const {
  filterByChamber,
  filterByDate,
  filterByFormation,
  filterByJurisdiction,
  filterByLocation,
  filterByParticularInterest,
  filterByPublication,
  filterBySolution,
  filterByTheme,
  filterByType,
  filterByWithFileOfType,
  buildFilter,
} = require('./utils/query/filters');

const { filterByFreeTextTheme, buildMustByFilters } = require('./utils/query/filtersFreeText');
const { sort } = require('./utils/query/helpers');

function buildScanQuery(query) {
  return {
    index: process.env.ELASTIC_INDEX,
    preference: 'preventbouncingresults',
    explain: false,
    size: query.batch_size || 10,
    _source: true,
    body: {
      track_scores: false,
      query: {
        function_score: {
          query: {
            bool: {
              filter: buildFilter(
                query,
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
              must: buildMustByFilters(query, filterByFreeTextTheme),
            },
          },
        },
      },
      ...(query.searchAfter ? { search_after: formatUrlParamsIntoSearchAfter(query) } : {}),
      sort: sort({ ...query, sort: undefined }),
    },
  };
}

function formatDecisionToResponse(rawResult, query) {
  const result = rawResult._source;

  const resume = {
    id: rawResult._id,
    jurisdiction: formatJurisdiction(result, query),
    chamber: formatChamber(result, query),
    number: formatNumber(result),
    numbers: formatNumbers(result),
    ecli: result.ecli,
    formation: formatFormation(result, query),
    location: formatLocation(result, query),
    publication: formatPublication(result, query),
    decision_date: result.decision_date,
    decision_datetime: result.decision_datetime,
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

  const details = {
    source: result.source,
    text: result.displayText,
    update_date: result.update_date,
    update_datetime: result.update_datetime,
    ...(result.partial && result.zones ? {} : { zones: result.zones }),
    contested: result.contested ? result.contested : null,
    forward: result.forward ? result.forward : null,
    visa: result.visa ? result.visa.map((item) => ({ title: item })) : [],
    rapprochements: result?.rapprochements?.value ?? [],
    ...(Array.isArray(result.timeline) && result.timeline.length < 2
      ? {}
      : { timeline: result.timeline ? result.timeline : null }),
    partial: result.partial ? result.partial : false,
    legacy: result.legacy ? result.legacy : {}
  };

  return query.abridged ? resume : { ...resume, ...details };
}

async function fetchScan({ client }, query) {
  const searchQuery = buildScanQuery(query);

  const resultCount = await client.count({
    index: searchQuery.index,
    body: { query: searchQuery.body.query },
  });
  const rawResponse = await client.search(searchQuery);
  const responses = rawResponse.body.hits.hits ?? [];

  const { cursorBefore, cursorAfter } = await getCursors(responses, searchQuery, client);

  return {
    batch_from: searchQuery.searchAfter,
    batch_size: searchQuery.page_size,
    query,
    total: resultCount?.body?.count ?? 0,
    previous_batch: formatSearchAfterIntoUrlParams(query, cursorBefore),
    next_batch: formatSearchAfterIntoUrlParams(query, cursorAfter),
    took: rawResponse?.body?.took ?? 0,
    results: responses.map((_) => formatDecisionToResponse(_, query)),
    searchQuery,
    date: new Date(),
  };
}

module.exports = fetchScan;
