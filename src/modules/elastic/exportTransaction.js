require('../env');

async function exportTransaction({ date, page_size: pageSize = 500, from_id: fromId, point_in_time: pointInTime }) {
  if (process.env.WITHOUT_ELASTIC) return;

  const timeId =
    pointInTime ??
    (await this.client.openPointInTime({ index: process.env.TRANSACTION_INDEX, keep_alive: '1m' }))?.body?.id;
  if (!timeId) throw new Error('Uncaught to create a search context');

  const query = {
    body: {
      query: { range: { date: { gte: new Date(date) } } },
      sort: [{ date: 'asc' }],
      size: pageSize,
      search_after: fromId ? [fromId] : undefined,
      pit: { id: timeId, keep_alive: '1m' },
    },
  };

  const results = await this.client.search(query);
  const hits = results?.body?.hits?.hits ?? [];
  const total = results?.body?.hits?.total?.value ?? 0;

  const [lastId = null] = hits.length === pageSize ? hits[hits.length - 1].sort : [];
  const nextPit = results?.body?.pit_id;

  return {
    transactions: hits.map((hit) => hit._source),
    next_page: lastId
      ? new URLSearchParams({ date, page_size: pageSize, from_id: lastId, point_in_time: nextPit }).toString()
      : null,
    page_size: hits.length,
    total,
    query_date: new Date(),
  };
}

module.exports = exportTransaction;
