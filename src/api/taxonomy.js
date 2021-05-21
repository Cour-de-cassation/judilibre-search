require('../modules/env');
const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const route = 'taxonomy';

api.get(`/${route}/:query`, async (req, res) => {
  try {
    const result = await getTaxonomy(req.params.query);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ errors: [{ location: route, msg: 'Internal Server Error', error: e.message }] });
  }
});

async function getTaxonomy(query) {
  return {
    route: route,
    query: query,
  };
}

module.exports = api;
