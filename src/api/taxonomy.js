require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
// const Elastic = require('../modules/elastic');
const route = 'taxonomy';

const taxons = require('../taxons');

api.get(
  `/${route}`,
  checkSchema({
    id: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      optional: true,
    },
    key: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      optional: true,
    },
    value: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      optional: true,
    },
    context_value: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      optional: true,
    },
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ route: `${req.method} ${req.path}`, errors: errors.array() });
    }
    if ((req.query.key || req.query.value || req.query.context_value) && !req.query.id) {
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: [
          {
            value: '',
            msg: 'The id parameter is required.',
            param: 'id',
            location: 'query',
          },
        ],
      });
    }
    if (req.query.id && Object.keys(taxons).indexOf(req.query.id) === -1) {
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: [
          {
            value: req.query.id,
            msg: `Value of the id parameter must be in [${Object.keys(taxons)}].`,
            param: 'id',
            location: 'query',
          },
        ],
      });
    }
    try {
      const result = await getTaxonomy(req.query);
      return res.status(200).json(result);
    } catch (e) {
      return res
        .status(500)
        .json({ route: `${req.method} ${req.path}`, errors: [{ msg: 'Internal Server Error', error: e.message }] });
    }
  },
);

async function getTaxonomy(query) {
  return {
    route: `GET /${route}`,
    query: query,
  };
}

module.exports = api;
