require('../env');

async function exportTransaction({ date, page = 0, page_size = 40 }) {
  if (process.env.WITHOUT_ELASTIC) return;

  const offset = page * page_size + 1;

  const query = {
    index: process.env.TRANSACTION_INDEX,
    body: {
      query: { range: { date: { gte: new Date(date) } } },
      sort: [{ date: 'asc' }],
      from: offset,
      size: page_size,
    },
  };

  const results = await this.client.search(query);
  const hits = results?.body?.hits?.hits ?? [];
  const total = results?.body?.hits?.total?.value ?? 0;
  const pages = parseInt(total / page_size);

  return {
    transactions: hits.map((hit) => hit._source),
    previous_page:
      page > 0
        ? new URLSearchParams({
            date,
            page: page > total / page_size ? parseInt(total / page_size) : page - 1,
            page_size,
          }).toString()
        : null,
    next_page: offset + page_size < total ? new URLSearchParams({ date, page: page + 1, page_size }).toString() : null,
    page_size: page_size,
    total,
    pages,
    query_date: new Date(),
  };
}

module.exports = exportTransaction;
