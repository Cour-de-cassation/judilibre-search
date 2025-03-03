require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const taxons = require('../taxons');
const route = 'stats';

const AGGREGATION_KEYS = [
  'jurisdiction',
  'source',
  'location',
  'year',
  'month',
  'chamber',
  'formation',
  'solution',
  'type',
  'nac',
  'themes',
  'publication',
]
const ALL_LOCATIONS = [...taxons.ca.location.keys, ...taxons.tj.location.keys, ...taxons.tcom.location.keys]
const ALL_JURISDICTIONS = [...taxons.all.jurisdiction.keys]

const AGGREGATION_KEYS_REGEX = `^(${AGGREGATION_KEYS.join('|')})(,(${AGGREGATION_KEYS.join('|')}))*$`
const ALL_LOCATIONS_REGEX = `^(${ALL_LOCATIONS.join('|')})(,(${ALL_LOCATIONS.join('|')}))*$`
const ALL_JURISDICTIONS_REGEX = `^(${ALL_JURISDICTIONS.join('|')})$`

api.get(
  `/${route}`,
  checkSchema({
    jurisdiction: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      matches: {
        options: [RegExp(ALL_JURISDICTIONS_REGEX)],
        errorMessage: `Value of the jurisdiction parameter must be in [${ALL_JURISDICTIONS}].`,
      },
      optional: true,
    },
    particularInterest: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      matches: {
        options: [RegExp('true')],
        errorMessage: `Value of the particularInterest parameter must be in true.`,
      },
      optional: true,
    },
    location: {
      in: 'query',
      matches: {
        options: [RegExp(ALL_LOCATIONS_REGEX)],
        errorMessage: `Aggregation keys parameters must be a valid jurisdiction identifier (see GET /taxonomy) or a comma separated list of these values.`,
      },
      optional: true,
    },
    date_start: {
      in: 'query',
      isString: true,
      isISO8601: true,
      errorMessage: `Start date must be a valid ISO-8601 date (e.g. 2021-05-13).`,
      optional: true,
    },
    date_end: {
      in: 'query',
      isString: true,
      isISO8601: true,
      errorMessage: `End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).`,
      optional: true,
    },
    keys: {
      in: 'query',
      matches: {
        options: [RegExp(AGGREGATION_KEYS_REGEX)],
        errorMessage: `Aggregation keys parameters must be in [${AGGREGATION_KEYS}] or a comma separated list of these values.`,
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
