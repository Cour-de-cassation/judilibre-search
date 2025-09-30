const { inverseSort } = require('./query/helpers');

const INITIAL_VALUE = 'INITIAL_VALUE';

async function getCursorAfter(responses, searchQuery, client) {
  if (responses.length < searchQuery.size) return null;

  const lastElement = responses[responses.length - 1];
  const searchAfter = lastElement.sort;

  const nextElements = await client.search({
    ...searchQuery,
    body: { ...searchQuery.body, search_after: searchAfter },
    size: 1,
  });
  return (nextElements?.body?.hits?.hits ?? []).length > 0 ? searchAfter : null;
}

async function getCursorBefore(responses, searchQuery, client) {
  if (responses.length === 0) return null;
  const searchBefore = responses[0].sort;
  const invertedSort = inverseSort(searchQuery.body.sort);

  const rawPreviousElements = await client.search({
    ...searchQuery,
    body: { ...searchQuery.body, sort: invertedSort, search_after: searchBefore },
    size: searchQuery.size + 1,
  });
  const previousElements = rawPreviousElements?.body?.hits?.hits ?? [];

  if (previousElements.length === 0) return null;
  if (previousElements.length < searchQuery.size + 1) return INITIAL_VALUE;

  const firstElementFromPrevious = previousElements[previousElements.length - 1];
  return firstElementFromPrevious.sort;
}

async function getCursors(responses, searchQuery, client) {
  const cursorBefore = await getCursorBefore(responses, searchQuery, client);
  const cursorAfter = await getCursorAfter(responses, searchQuery, client);

  return {
    cursorBefore,
    cursorAfter,
  };
}

function getPages(currentPage, size, total) {
  const pageBefore = currentPage <= 0 ? 0 : currentPage - 1;
  const pageAfter = currentPage * size < total ? currentPage + 1 : null;
  return { pageBefore, pageAfter };
}

module.exports = {
  INITIAL_VALUE,
  getCursors,
  getPages
};
