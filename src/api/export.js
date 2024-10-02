require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const taxons = require('../taxons');
const route = 'export';
const iso8601 =
  /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-3])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

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
    date_type: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.date_type.options],
      },
      errorMessage: `Value of the date_type parameter must be in [${taxons.all.date_type.keys}].`,
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
    withFileOfType: {
      in: 'query',
      toArray: true,
    },
    'withFileOfType.*': {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.filetype.options],
      },
      errorMessage: `Value(s) of the withFileOfType parameter must be in [${taxons.all.filetype.keys}].`,
      optional: true,
    },
    'legacy.*': {
      in: 'query',
      optional: true,
    },
    particularInterest: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the particularInterest parameter must be a boolean.`,
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
      return res.status(500).json({
        route: `${req.method} ${req.path}`,
        errors: [{ msg: 'Internal Server Error', error: JSON.stringify(e, e ? Object.getOwnPropertyNames(e) : null) }],
      });
    }
  },
);

async function getExport(query) {
  return await Elastic.export(query);
}

module.exports = api;
