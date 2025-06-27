require('../env');

async function exportTransaction({ date, page_size: pageSize = 500, from_id: fromId, point_in_time: pointInTime }) {
  if (process.env.WITHOUT_ELASTIC) return;

  const query = {
    index: process.env.TRANSACTION_INDEX,
    body: {
      query: { range: { date: { gte: new Date(date) } } },
      sort: [{ date: 'asc' }, { _id: 'asc' }],
      size: pageSize,
      search_after: fromId ? fromId.split('&') : undefined,
    },
  };

  const results = await this.client.search(query);
  const resultCount = await this.client.count({ 
    index: process.env.TRANSACTION_INDEX,
    body: { query: query.body.query }
  });

  const hits = results?.body?.hits?.hits ?? [];
  const total = resultCount?.body?.count ?? 0;

  const step = hits.length === pageSize ? hits[hits.length - 1].sort : null;

  return {
    transactions: hits.map((hit) => hit._source),
    next_page: step
      ? new URLSearchParams({ date, page_size: pageSize, from_id: step.join('&') }).toString()
      : null,
    page_size: hits.length,
    total,
    query_date: new Date(),
  };
}

module.exports = exportTransaction;
