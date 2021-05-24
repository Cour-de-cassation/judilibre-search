require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
// const Elastic = require('../modules/elastic');
const route = 'search';

const field = require('../taxons/field');
const operator = require('../taxons/operator');
const type = require('../taxons/type');
const theme = require('../taxons/theme');
const chamber = require('../taxons/chamber');
const formation = require('../taxons/formation');
const jurisdiction = require('../taxons/jurisdiction');
const committee = require('../taxons/committee');
const publication = require('../taxons/publication');
const solution = require('../taxons/solution');
const sort = require('../taxons/sort');
const order = require('../taxons/order');

api.get(
  `/${route}`,
  checkSchema({
    query: {
      in: 'query',
      isString: true,
      toLowerCase: true,
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
        options: [field.options],
      },
      errorMessage: `Value of the field parameter must be in [${field.keys}].`,
      optional: true,
    },
    operator: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [operator.options],
      },
      errorMessage: `Value of the operator parameter must be in [${operator.keys}].`,
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
        options: [type.options],
      },
      errorMessage: `Value of the type parameter must be in [${type.keys}].`,
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
      isIn: {
        options: [theme.options],
      },
      errorMessage: `Value of the theme parameter must be in [${theme.keys}].`,
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
        options: [chamber.options],
      },
      errorMessage: `Value of the chamber parameter must be in [${chamber.keys}].`,
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
        options: [formation.options],
      },
      errorMessage: `Value of the formation parameter must be in [${formation.keys}].`,
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
        options: [jurisdiction.options],
      },
      errorMessage: `Value of the jurisdiction parameter must be in [${jurisdiction.keys}].`,
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
        options: [committee.options],
      },
      errorMessage: `Value of the committee parameter must be in [${committee.keys}].`,
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
        options: [publication.options],
      },
      errorMessage: `Value of the publication parameter must be in [${publication.keys}].`,
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
        options: [solution.options],
      },
      errorMessage: `Value of the solution parameter must be in [${solution.keys}].`,
      optional: true,
    },
    date_start: {
      in: 'query',
      isISO8601: true,
      errorMessage: `Start date must be of type ISO-8601 (e.g. 2021-05-13).`,
      optional: true,
    },
    date_end: {
      in: 'query',
      isISO8601: true,
      errorMessage: `End date must be of type ISO-8601 (e.g. 2021-05-13).`,
      optional: true,
    },
    sort: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [sort.options],
      },
      errorMessage: `Value of the sort parameter must be in [${sort.keys}].`,
      optional: true,
    },
    order: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [order.options],
      },
      errorMessage: `Value of the order parameter must be in [${order.keys}].`,
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
      errorMessage: `Value of the page_size parameter must be an integer between 1 and 50.`,
      optional: true,
    },
    page: {
      in: 'query',
      isInt: true,
      errorMessage: `Value of the page parameter must be an integer.`,
      optional: true,
    },
    resolve_references: {
      in: 'query',
      isBoolean: true,
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
      const result = await getSearch(req.query);
      return res.status(200).json(result);
    } catch (e) {
      return res
        .status(500)
        .json({ route: `${req.method} ${req.path}`, errors: [{ msg: 'Internal Server Error', error: e.message }] });
    }
  },
);

async function getSearch(query) {
  return {
    route: `GET /${route}`,
    query: query,
  };
}

module.exports = api;
