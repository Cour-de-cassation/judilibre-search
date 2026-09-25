const SEARCH_AFTER_INITIAL_VALUE = "SEARCH_AFTER_INITIAL_VALUE"

async function getSearchAfter(responses, searchQuery, client) {
  if (responses.length < searchQuery.size) return null;

  const lastElement = responses[responses.length - 1];
  const searchAfter = lastElement.sort

  const nextElements = await client.search({ ...searchQuery, body: { ...searchQuery.body, search_after: searchAfter }, size: 1 });
  return (nextElements?.body?.hits?.hits ?? []).length > 0 ? searchAfter : null;
}
module.exports.getSearchAfter = getSearchAfter

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
module.exports.getSearchBefore = getSearchBefore

function formatSearchAfterIntoUrlParams(query, searchAfter) {
    const { searchAfter: _, ...relevantQuery } = query
    if (!searchAfter) return null
    if(searchAfter === SEARCH_AFTER_INITIAL_VALUE) return formatQueryIntoUrlParams(relevantQuery)
    return formatQueryIntoUrlParams({ ...relevantQuery, searchAfter: searchAfter.join("&") })
}
module.exports.formatSearchAfterIntoUrlParams = formatSearchAfterIntoUrlParams


function formatUrlParamsIntoSearchAfter(query) {
    const rawSearchAfter = query.searchAfter.split("&")
    return [Number(rawSearchAfter[0]), Number(rawSearchAfter[1]), rawSearchAfter[2]]
}   
module.exports.formatUrlParamsIntoSearchAfter = formatUrlParamsIntoSearchAfter
