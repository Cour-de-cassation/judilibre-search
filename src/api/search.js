require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const taxons = require('../taxons');
const route = 'search';

api.get(
  `/${route}`,
  checkSchema({
    query: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the query parameter must be a string.`,
      optional: true,
    },
    field: {
      in: 'query',
      toArray: true,
    },
    'field.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.field.options],
      },
      errorMessage: `Value of the field parameter must be in [${taxons.all.field.keys}].`,
      optional: true,
    },
    operator: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.operator.options],
      },
      errorMessage: `Value of the operator parameter must be in [${taxons.all.operator.keys}].`,
      optional: true,
    },
    type: {
      in: 'query',
      toArray: true,
    },
    'type.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.type.options],
      },
      errorMessage: `Value of the type parameter must be in [${taxons.all.type.keys}].`,
      optional: true,
    },
    theme: {
      in: 'query',
      toArray: true,
    },
    'theme.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      errorMessage: `Theme parameter must be an array of strings.`,
      optional: true,
    },
    chamber: {
      in: 'query',
      toArray: true,
    },
    'chamber.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.chamber.options],
      },
      errorMessage: `Value of the chamber parameter must be in [${taxons.all.chamber.keys}].`,
      optional: true,
    },
    formation: {
      in: 'query',
      toArray: true,
    },
    'formation.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.formation.options],
      },
      errorMessage: `Value of the formation parameter must be in [${taxons.all.formation.keys}].`,
      optional: true,
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
    location: {
      in: 'query',
      toArray: true,
    },
    'location.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.location.options],
      },
      errorMessage: `Value of the location parameter must be in [${taxons.all.location.keys}].`,
      optional: true,
    },
    publication: {
      in: 'query',
      toArray: true,
    },
    'publication.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.publication.options],
      },
      errorMessage: `Value of the publication parameter must be in [${taxons.all.publication.keys}].`,
      optional: true,
    },
    solution: {
      in: 'query',
      toArray: true,
    },
    'solution.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.solution.options],
      },
      errorMessage: `Value of the solution parameter must be in [${taxons.all.solution.keys}].`,
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
      errorMessage: `End date must be a valid ISO-8601 date (e.g. 2021-05-13).`,
      optional: true,
    },
    sort: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.sort.options],
      },
      errorMessage: `Value of the sort parameter must be in [${taxons.all.sort.keys}].`,
      optional: true,
    },
    order: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.order.options],
      },
      errorMessage: `Value of the order parameter must be in [${taxons.all.order.keys}].`,
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
    resolve_references: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the resolve_references parameter must be a boolean.`,
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
    } else if (req.query && typeof req.query.query === 'string' && req.query.query.length > 512) {
      // Does not work in schema (using isLength {min, max}):
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: [
          {
            value: req.query.query,
            msg: 'The query parameter must not contain more than 512 characters.',
            param: 'query',
            location: 'query',
          },
        ],
      });
    } else if (
      req.query &&
      typeof req.query.date_start === 'string' &&
      /^\d\d\d\d-\d\d-\d\d$/.test(req.query.date_start) === false
    ) {
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: [
          {
            value: req.query.date_start,
            msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13).',
            param: 'date_start',
            location: 'query',
          },
        ],
      });
    } else if (
      req.query &&
      typeof req.query.date_end === 'string' &&
      /^\d\d\d\d-\d\d-\d\d$/.test(req.query.date_end) === false
    ) {
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: [
          {
            value: req.query.date_end,
            msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13).',
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
      const result = await getSearch(req.query);
      if (result.errors) {
        return res.status(400).json({
          route: `${req.method} ${req.path}`,
          errors: result.errors,
        });
      }
      return res.status(200).json(result);
    } catch (e) {
      return res
        .status(500)
        .json({ route: `${req.method} ${req.path}`, errors: [{ msg: 'Internal Server Error', error: e.message }] });
    }
  },
);

async function getSearch(query) {
  return await Elastic.search(query);
}

module.exports = api;
