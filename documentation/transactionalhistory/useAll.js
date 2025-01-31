/* 
This example shows how to use the "transactionalHistory" route from judilibre.
It logs decision IDs that have been deleted from the last 24 hours.
*/

const { get } = require("axios");
const querystring = require('node:querystring'); 
require("dotenv").config();

const { JUDILIBRE_API_URL } = process.env
const YESTERDAY = new Date(Date.now() - 24 * 60 * 60 * 1000)

async function getTransactionalHistory(query) {
    const history = await get(`${JUDILIBRE_API_URL}/transactionalHistory?${query}`)
    return history.data
}

async function getAllHistory(query) {
    if (!query) return []
    const { transactions, next_page } = await getTransactionalHistory(query)
    // use next_page to query the next chunk and aggregate results:
    return [...transactions, ...(await getAllHistory(next_page))]
}

function useDelete(id) { console.log(`deleted: ${id}`) }

async function doingSomethingWithDeleted() {
    const transactions = await getAllHistory(querystring.stringify({ date: YESTERDAY.toISOString() }))
    // filter on action and use the results:
    return transactions
        .filter(transaction => transaction.action == 'deleted')
        .map(transaction => useDelete(transaction.id))
}

doingSomethingWithDeleted().catch(console.error)