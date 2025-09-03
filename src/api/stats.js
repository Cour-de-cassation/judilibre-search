require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const taxons = require('../taxons');
const route = 'stats';
const { VALIDATORS } = require("./validators")

api.get(
  `/${route}`,
  checkSchema({
    ...VALIDATORS.JURISDICTIONS,
    ...VALIDATORS.LOCATIONS,
    ...VALIDATORS.PARTICULAR_INTEREST,
    ...VALIDATORS.DATE_START,
    ...VALIDATORS.DATE_END,
    ...VALIDATORS.DATE_TYPE,
    ...VALIDATORS.STATS_AGGREGATION_KEYS,
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ route: `${req.method} ${req.path}`, errors: errors.array() });
    }
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
