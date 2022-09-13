require('../modules/env');
const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const route = 'stats';

api.get(`/${route}`, async (req, res) => {
  try {
    const result = await getStats(req.query);
    if (result.errors) {
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: result.errors,
      });
    }
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({
      route: `${req.method} ${req.path}`,
      errors: [{ msg: 'Internal Server Error', error: JSON.stringify(e, e ? Object.getOwnPropertyNames(e) : null) }],
    });
  }
});

async function getStats(query) {
  return await Elastic.stats(query);
}

module.exports = api;
