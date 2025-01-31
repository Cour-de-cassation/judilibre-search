/* 
This example shows how to use the "transactionalHistory" route from judilibre.
It logs decision IDs that have been deleted from the last 24 hours.

This script query and execute "console.log" 10 by 10 without stock it in memory.
Warn: next_page querystring is only valid for 1 minute. 
*/

const { get } = require('axios');
const querystring = require('node:querystring');
require('dotenv').config();

const { JUDILIBRE_API_URL } = process.env;
const YESTERDAY = new Date(Date.now() - 24 * 60 * 60 * 1000);

async function getTransactionalHistory(query) {
  const history = await get(`${JUDILIBRE_API_URL}/transactionalHistory?${query}`);
  return history.data;
}
function useDelete(id) {
  console.log(`deleted: ${id}`);
}

async function doingSomethingInPipeWithDeleted(query) {
  if (!query)
    query = querystring.stringify({
      date: YESTERDAY.toISOString(),
      page_size: 10,
    });

  // get a chunk of 10
  const { transactions, next_page } = await getTransactionalHistory(query);

  // use this 10
  transactions
    .filter((transaction) => transaction.action == 'deleted')
    .forEach((transaction) => useDelete(transaction.id));

  // use next_page to query the next chunk of 10:
  if (next_page) doingSomethingInPipeWithDeleted(next_page);
}

doingSomethingInPipeWithDeleted().catch(console.error);
