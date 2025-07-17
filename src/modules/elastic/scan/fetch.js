const { buildQuery } = require('./query');
const { formatElasticToResponse, inverseSort, formatSearchAfterIntoUrlParams, formatQueryIntoUrlParams, SEARCH_AFTER_INITIAL_VALUE } = require('./format');

async function getSearchAfter(responses, searchQuery, client) {
  if (responses.length < searchQuery.size) return null;

  const lastElement = responses[responses.length - 1];
  const searchAfter = lastElement.sort

  const nextElements = await client.search({ ...searchQuery, body: { ...searchQuery.body, search_after: searchAfter }, size: 1 });
  return (nextElements?.body?.hits?.hits ?? []).length > 0 ? searchAfter : null;
}

async function getSearchBefore(responses, searchQuery, client) {
  if (responses.length === 0) return null
  const searchBefore = responses[0].sort
  const invertedSort = inverseSort(searchQuery.body.sort);

  const rawPreviousElements = await client.search({
    ...searchQuery,
    body: { ...searchQuery.body, sort: invertedSort, search_after: searchBefore },
    size: searchQuery.size + 1
  });
  const previousElements = rawPreviousElements?.body?.hits?.hits ?? [];

  if (previousElements.length === 0) return null;
  if (previousElements.length < searchQuery.size + 1) return SEARCH_AFTER_INITIAL_VALUE;
  
  const firstElementFromPrevious = previousElements[previousElements.length-1];
  return firstElementFromPrevious.sort;
}

async function batchScan({ client }, query) {
  const searchQuery = buildQuery(query);

  const resultCount = await client.count({
    index: searchQuery.index,
    body: { query: searchQuery.body.query },
  });
  const rawResponse = await client.search(searchQuery);
  const responses = rawResponse.body.hits.hits ?? [];

  const searchBefore = await getSearchBefore(responses, searchQuery, client);
  const searchAfter = await getSearchAfter(responses, searchQuery, client);

  return {
    batch_from: searchQuery.searchAfter,
    batch_size: searchQuery.page_size,
    query,
    total: resultCount?.body?.count ?? 0,
    previous_batch: formatSearchAfterIntoUrlParams(query, searchBefore),
    next_batch: formatSearchAfterIntoUrlParams(query, searchAfter),
    took: rawResponse?.body?.took ?? 0,
    results: responses.map((_) => formatElasticToResponse(_, query)),
    searchQuery,
    date: new Date(),
  };
}

module.exports = batchScan;
