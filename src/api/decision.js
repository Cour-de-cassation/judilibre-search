require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const route = 'decision';

api.get(
  `/${route}`,
  checkSchema({
    id: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the id parameter must be a string.`,
      optional: false,
    },
    query: {
      in: 'query',
      isObject: true,
      errorMessage: `Value of the query parameter must be an object.`,
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
      const result = await getDecision(req.query);
      if (result === null) {
        return res.status(404).json({
          route: `${req.method} ${req.path}`,
          errors: [{ msg: 'Not Found', error: `Decision '${req.query.id}' not found.` }],
        });
      } else if (result.errors) {
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

async function getDecision(query) {
  return await Elastic.decision(query);
}

module.exports = api;
