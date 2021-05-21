require('../modules/env');
const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const pathId = 'export';

api.get(`/${pathId}/:query`, async (req, res) => {
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(await getExport(req.params.query)));
});

async function getExport(query) {
  return {
    path: pathId,
    query: query,
  };
}

module.exports = api;
