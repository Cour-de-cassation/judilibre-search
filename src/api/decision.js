require('../modules/env');
const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const pathId = 'decision';

api.get(`/${pathId}/:query`, async (req, res) => {
  res.status(200).json(await getDecision(req.params.query));
});

async function getDecision(query) {
  return {
    path: pathId,
    query: query,
  };
}

module.exports = api;
