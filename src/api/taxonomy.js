require('../modules/env');
const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const taxons = require('../taxons');
const route = 'taxonomy';

api.get(
  `/${route}`,
  checkSchema({
    id: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the id parameter must be a string.`,
      toLowerCase: true,
      optional: true,
    },
    key: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the key parameter must be a string.`,
      toLowerCase: true,
      optional: true,
    },
    value: {
      in: 'query',
      isString: true,
      errorMessage: `Value parameter must be a string.`,
      optional: true,
    },
    context_value: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the context_value parameter must be a string.`,
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
      if (result.errors) {
        return res.status(404).json({
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

async function getTaxonomy(query) {
  if (!query.id && !query.key && !query.value && !query.context_value) {
    return {
      result: Object.keys(taxons),
    };
  }
  if (query.id) {
    if (query.context_value && ['cc', 'ca', 'tj'].indexOf(query.context_value) === -1) {
      return {
        errors: [
          {
            value: query.context_value,
            msg: `Unknown value for the given context_value parameter.`,
            param: 'context_value',
            location: 'query',
          },
        ],
      };
    } else if (!query.context_value) {
      query.context_value = 'cc';
    }
    if (!query.key && !query.value) {
      return {
        id: query.id,
        context_value: query.context_value,
        result: taxons[query.context_value][query.id].tree
          ? taxons[query.context_value][query.id].tree
          : taxons[query.context_value][query.id].taxonomy,
      };
    } else if (query.key && !query.value) {
      if (taxons[query.context_value][query.id].taxonomy[query.key] === undefined) {
        return {
          errors: [
            {
              value: query.key,
              msg: `Value not found for the given key parameter in '${query.id}'.`,
              param: 'key',
              location: 'query',
            },
          ],
        };
      }
      return {
        id: query.id,
        key: query.key,
        context_value: query.context_value,
        result: {
          value: taxons[query.context_value][query.id].taxonomy[query.key],
        },
      };
    } else if (query.value && !query.key) {
      let found = null;
      for (let key in taxons[query.context_value][query.id].taxonomy) {
        if (taxons[query.context_value][query.id].taxonomy[key].toLowerCase() === query.value.toLowerCase()) {
          found = key;
          break;
        }
      }
      if (found === null) {
        return {
          errors: [
            {
              value: query.value,
              msg: `Key not found for the given value parameter in '${query.id}'.`,
              param: 'value',
              location: 'query',
            },
          ],
        };
      }
      return {
        id: query.id,
        value: query.value,
        context_value: query.context_value,
        result: {
          key: found,
        },
      };
    }
  }
  throw new Error(`${process.env.APP_ID}/taxonomy: cannot process request.`);
}

module.exports = api;
