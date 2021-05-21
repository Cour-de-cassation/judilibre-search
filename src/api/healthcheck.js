require('../modules/env');
const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const route = 'healthcheck';

api.get(`/${route}`, async (req, res) => {
  try {
    const result = await getHealthcheck(req.query);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ errors: [{ route: route, msg: 'Internal Server Error', error: e.message }] });
  }
});

async function getHealthcheck(query) {
  return {
    route: route,
    query: query,
  };
}

module.exports = api;
