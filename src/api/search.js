require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const route = 'search';

api.get(
  `/${route}`,
  checkSchema({
    query: {
      in: ['query'],
      isString: true,
      toLowerCase: true,
      optional: true,
    },
    field: {
      in: ['query'],
      isArray: true,
      optional: true,
    },
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const result = await getSearch(req.query);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({ errors: [{ route: route, msg: 'Internal Server Error', error: e.message }] });
    }
  },
);

async function getSearch(query) {
  return {
    route: route,
    query: query,
  };
}

module.exports = api;
