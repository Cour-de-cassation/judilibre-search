require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const taxons = require('../taxons');
const route = 'export';

api.get(
  `/${route}`,
  checkSchema({
    type: {
      in: 'query',
      toArray: true,
    },
    'type.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.type.options],
      },
      errorMessage: `Value of the type parameter must be in [${taxons.type.keys}].`,
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
        options: [taxons.chamber.options],
      },
      errorMessage: `Value of the chamber parameter must be in [${taxons.chamber.keys}].`,
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
        options: [taxons.formation.options],
      },
      errorMessage: `Value of the formation parameter must be in [${taxons.formation.keys}].`,
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
        options: [taxons.jurisdiction.options],
      },
      errorMessage: `Value of the jurisdiction parameter must be in [${taxons.jurisdiction.keys}].`,
      optional: true,
    },
    committee: {
      in: 'query',
      toArray: true,
    },
    'committee.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.committee.options],
      },
      errorMessage: `Value of the committee parameter must be in [${taxons.committee.keys}].`,
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
        options: [taxons.publication.options],
      },
      errorMessage: `Value of the publication parameter must be in [${taxons.publication.keys}].`,
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
        options: [taxons.solution.options],
      },
      errorMessage: `Value of the solution parameter must be in [${taxons.solution.keys}].`,
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
    date_type: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.date_type.options],
      },
      errorMessage: `Value of the date_type parameter must be in [${taxons.date_type.keys}].`,
      optional: true,
    },
    order: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.order.options],
      },
      errorMessage: `Value of the order parameter must be in [${taxons.order.keys}].`,
      optional: true,
    },
    batch_size: {
      in: 'query',
      isInt: {
        options: {
          min: 1,
          max: 1000,
        },
      },
      toInt: true,
      errorMessage: `Value of the batch_size parameter must be an integer between 1 and 1000.`,
      optional: true,
    },
    batch: {
      in: 'query',
      isInt: {
        options: {
          min: 0,
        },
      },
      toInt: true,
      errorMessage: `Value of the batch parameter must be an integer greater or equal than 0.`,
      optional: false,
    },
    abridged: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the abridged parameter must be a boolean.`,
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ route: `${req.method} ${req.path}`, errors: errors.array() });
    }
    try {
      const result = await getExport(req.query);
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

async function getExport(query) {
  return await Elastic.export(query);
}

module.exports = api;
