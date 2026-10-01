require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const taxons = require('../taxons');
const route = 'search-experimental';
const iso8601 =
  /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

api.get(
  `/${route}`,
  checkSchema({
    querystring: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the query parameter must be a string.`,
      optional: false,
    },
    jurisdiction: {
      in: 'query',
      toArray: true,
    },
    'jurisdiction.*': {
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
      isISO8601: true,
      errorMessage: `Start date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).`,
      optional: true,
    },
    date_end: {
      in: 'query',
      isString: true,
      isISO8601: true,
      errorMessage: `End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).`,
      optional: true,
    },
    page_size: {
      in: 'query',
      isInt: {
        options: {
          min: 1,
          max: 50,
        },
      },
      toInt: true,
      errorMessage: `Value of the page_size parameter must be an integer between 1 and 50.`,
      optional: true,
    },
    page: {
      in: 'query',
      isInt: {
        options: {
          min: 0,
        },
      },
      toInt: true,
      errorMessage: `Value of the page parameter must be an integer greater or equal than 0.`,
      optional: true,
    },
  }),
  async (req, res) => {
    if (process.env.APP_HOST_ALTER === undefined) {
      process.env.APP_HOST_ALTER = req.hostname;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ route: `${req.method} ${req.path}`, errors: errors.array() });
    } else if (req.query && typeof req.query.query === 'string' && req.query.query.length > 1024) {
      // Does not work in schema (using isLength {min, max}):
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: [
          {
            value: req.query.query,
            msg: 'The query parameter must not contain more than 1024 characters.',
            param: 'query',
            location: 'query',
          },
        ],
      });
    } else if (req.query && typeof req.query.date_start === 'string' && iso8601.test(req.query.date_start) === false) {
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: [
          {
            value: req.query.date_start,
            msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
            param: 'date_start',
            location: 'query',
          },
        ],
      });
    } else if (req.query && typeof req.query.date_end === 'string' && iso8601.test(req.query.date_end) === false) {
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: [
          {
            value: req.query.date_end,
            msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
            param: 'date_end',
            location: 'query',
          },
        ],
      });
    }
    if (req.query && req.query.page) {
      let page_size = req.query.page_size || 10;
      if (req.query.page * page_size + page_size > 10000) {
        return res.status(416).json({
          route: `${req.method} ${req.path}`,
          errors: [
            {
              msg: 'Range Not Satisfiable',
            },
          ],
        });
      }
    }
    try {
      const result = await getSearchExperimental(req.query);
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
  },
);

async function getSearchExperimental(query) {
  return await Elastic.searchExperimental(query);
}

module.exports = api;
