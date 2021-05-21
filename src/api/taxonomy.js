require('../modules/env');
const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const pathId = 'taxonomy';

api.get(`/${pathId}/:query`, async (req, res) => {
  res.status(200).json(await getTaxonomy(req.params.query));
});

async function getTaxonomy(query) {
  return {
    path: pathId,
    query: query,
  };
}

module.exports = api;
