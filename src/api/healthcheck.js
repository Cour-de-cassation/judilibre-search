require('../modules/env');
const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const pathId = 'healthcheck';

api.get(`/${pathId}/:query`, async (req, res) => {
  res.status(200).json(await getHealthcheck(req.params.query));
});

async function getHealthcheck(query) {
  return {
    path: pathId,
    query: query,
  };
}

module.exports = api;
