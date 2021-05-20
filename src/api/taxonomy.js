const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const pathId = 'taxonomy';

api.get(`/${pathId}/:query`, async (req, res) => {
  res.header('Content-Type', 'application/json');
  res.send(JSON.stringify(await getTaxonomy(req.params.query)));
});

async function getTaxonomy(query) {
  return {
    path: pathId,
    query: query,
  };
}

module.exports = api;
