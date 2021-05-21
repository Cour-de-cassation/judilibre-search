require('../modules/env');
const express = require('express');
const api = express.Router();
// const Elastic = require('../modules/elastic');
const route = 'healthcheck';

api.get(`/${route}`, async (req, res) => {
  try {
    const result = await getHealthcheck(req.query);
    return res.status(200).json(result);
  } catch (e) {
    return res
      .status(500)
      .json({ route: `${req.method} ${req.path}`, errors: [{ msg: 'Internal Server Error', error: e.message }] });
  }
});

async function getHealthcheck(query) {
  return {
    route: `GET /${route}`,
    query: query,
  };
}

module.exports = api;
