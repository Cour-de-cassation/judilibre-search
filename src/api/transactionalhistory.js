const express = require('express');
const api = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const route = 'transactionalhistory';

api.get(
  `/${route}`,
  checkSchema({
    date: {
      in: 'query',
      isString: true,
      isISO8601: true,
      errorMessage: `Start date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).`,
      optional: false,
    },
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
    from_id: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the from_id parameter must be a specific id.`,
      optional: true,
    }
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
