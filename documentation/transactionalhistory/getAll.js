/* 
This example shows how to use the "transactionalHistory" route from judilibre.
It just logs all operations executed on "decisions" from the last 24 hours.
*/

const { get } = require("axios");
const querystring = require("node:querystring");
require("dotenv").config();

const { JUDILIBRE_API_URL } = process.env;
const YESTERDAY = new Date(Date.now() - 24 * 60 * 60 * 1000);

async function getTransactionalHistory(query) {
  const history = await get(
    `${JUDILIBRE_API_URL}/transactionalHistory?${query}`
  );
  return history.data;
}

async function getAllHistory(query) {
  if (!query) return [];
  const { transactions, next_page } = await getTransactionalHistory(query);
  // use next_page to query the next chunk and aggregate results:
  return [...transactions, ...(await getAllHistory(next_page))];
}

getAllHistory(querystring.stringify({ date: YESTERDAY.toISOString() }))
  .then(console.log)
  .catch(console.error);
