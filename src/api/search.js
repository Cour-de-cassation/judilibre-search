require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
// const Elastic = require('../modules/elastic');
const route = 'search';

const field = require('../taxons/field');
const operator = require('../taxons/operator');

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
