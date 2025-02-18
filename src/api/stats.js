require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const taxons = require('../taxons');
const route = 'stats';

let aggregationKeys = [
  'jurisdiction',
  'source',
  'location',
  'year',
  'month',
  'chamber',
  'formation',
  'solution',
  'type',
  'theme',
]
let aggregationKeysRegex = `^(${aggregationKeys.join('|')})+(,(${aggregationKeys.join('|')}))*$`

api.get(
  `/${route}`,
  checkSchema({
    jurisdiction: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.jurisdiction.options],
      },
      errorMessage: `Value of the jurisdiction parameter must be in [${taxons.all.jurisdiction.keys}].`,
      optional: true,
    },
    date_start: {
      in: 'query',
      isString: true,
      isISO8601:true,
      errorMessage: `Start date must be a valid ISO-8601 date (e.g. 2021-05-13).`,
      optional: true,
    },
    date_end: {
      in: 'query',
      isString: true,
      isISO8601:true,
      errorMessage: `End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).`,
      optional: true,
    },
    keys: {
      in: 'query',
      matches: {
        options: [RegExp(aggregationKeysRegex)],
        errorMessage: `Aggregation keys parameters must be in [${aggregationKeys}] or a comma separated list of these values.`,
      },
      optional: true,
    }
  }
  ),
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
