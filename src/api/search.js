const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const pathId = 'search';

api.get(`/${pathId}/:query`, async (req, res) => {
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(await getSearch(req.params.query)));
});

async function getSearch(query) {
  return {
    path: pathId,
    query: query,
  };
}

module.exports = api;
