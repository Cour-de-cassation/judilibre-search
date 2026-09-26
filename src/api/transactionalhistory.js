const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const { VALIDATORS } = require('./validators');
const route = 'transactionalhistory';

api.get(
  `/${route}`,
  checkSchema({
    ...VALIDATORS.DATE,
    ...VALIDATORS.FROM_ID,
    page_size: {
      in: 'query',
      isInt: {
        options: {
          min: 10,
          max: 500,
        },
      },
      toInt: true,
      errorMessage: `Value of the page_size parameter must be an integer between 10 and 500.`,
      optional: true,
    },
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ route: `${req.method} ${req.path}`, errors: errors.array() });
    }

    try {
      const result = await Elastic.exportTransaction(req.query);
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({
        route: `${req.method} ${req.path}`,
        errors: [{ msg: 'Internal Server Error', error: JSON.stringify(e, e ? Object.getOwnPropertyNames(e) : null) }],
      });
    }
  },
);

module.exports = api;
