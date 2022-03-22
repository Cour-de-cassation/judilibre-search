require('../modules/env');
const express = require('express');
const api = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { checkSchema, validationResult } = require('express-validator');
const Elastic = require('../modules/elastic');
const taxons = require('../taxons');
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
    fileId: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the fileId parameter must be a string.`,
      optional: true,
    },
    showContested: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the showContested parameter must be a boolean.`,
      optional: true,
    },
    showForward: {
      in: 'query',
      isBoolean: true,
      toBoolean: true,
      errorMessage: `Value of the showForward parameter must be a boolean.`,
      optional: true,
    },
    query: {
      in: 'query',
      isString: true,
      errorMessage: `Value of the query parameter must be a string.`,
      optional: true,
    },
    operator: {
      in: 'query',
      isString: true,
      toLowerCase: true,
      isIn: {
        options: [taxons.all.operator.options],
      },
      errorMessage: `Value of the operator parameter must be in [${taxons.all.operator.keys}].`,
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
    if (process.env.APP_HOST_ALTER === undefined) {
      process.env.APP_HOST_ALTER = req.hostname;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ route: `${req.method} ${req.path}`, errors: errors.array() });
    } else if (req.query && typeof req.query.query === 'string' && req.query.query.length > 512) {
      // Does not work in schema (using isLength {min, max}):
      return res.status(400).json({
        route: `${req.method} ${req.path}`,
        errors: [
          {
            value: req.query.query,
            msg: 'The query parameter must not contain more than 512 characters.',
            param: 'query',
            location: 'query',
          },
        ],
      });
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
      if (req.query.fileId) {
        const file = getFile(result, req.query.fileId);
        if (file && file.rawUrl) {
          const filename = encodeURIComponent(file.name);
          fetch(file.rawUrl).then((fileStream) => {
            res.setHeader('Content-Length', fileStream.headers.get('content-length'));
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            fileStream.body.pipe(res);
          });
        } else {
          return res.status(404).json({
            route: `${req.method} ${req.path}`,
            errors: [{ msg: 'Not Found', error: `File '${req.query.fileId}' not found.` }],
          });
        }
      } else if (req.query.showContested && req.query.showForward) {
        // Does not work in schema:
        return res.status(400).json({
          route: `${req.method} ${req.path}`,
          errors: [
            {
              value: true,
              msg: 'showContested and showForward parameters cannot both be true at the same time.',
              param: 'showContested, showForward',
              location: 'query',
            },
          ],
        });
      } else if (req.query.showContested) {
        if (result && result.contested !== null && result.contested.content) {
          let contest_params = new URLSearchParams(req.query);
          contest_params.delete('showContested');
          const response = {
            id: result.contested.id,
            source: result.contested.source,
            text: result.contested.content,
            chamber: result.contested.title.split('\n')[1],
            decision_date: result.contested.date,
            jurisdiction: result.contested.title.split('\n')[0],
            number: result.contested.number,
            numbers: [result.contested.number],
            partial: result.contested.partial === true,
            forward: contest_params.toString(),
          };
          return res.status(200).json(response);
        } else {
          return res.status(404).json({
            route: `${req.method} ${req.path}`,
            errors: [{ msg: 'Not Found', error: `Contested decision not found for decision '${req.query.id}'.` }],
          });
        }
      } else if (req.query.showForward) {
        if (result && result.forward !== null && result.forward.content) {
          let contest_params = new URLSearchParams(req.query);
          contest_params.delete('showForward');
          const response = {
            id: result.forward.id,
            source: result.forward.source,
            text: result.forward.content,
            chamber: result.forward.title.split('\n')[1],
            decision_date: result.forward.date,
            jurisdiction: result.forward.title.split('\n')[0],
            number: result.forward.number,
            numbers: [result.forward.number],
            partial: result.forward.partial === true,
            contested: contest_params.toString(),
          };
          return res.status(200).json(response);
        } else {
          return res.status(404).json({
            route: `${req.method} ${req.path}`,
            errors: [{ msg: 'Not Found', error: `Forward decision not found for decision '${req.query.id}'.` }],
          });
        }
      } else {
        if (result && result.files && Array.isArray(result.files)) {
          for (let i = 0; i < result.files.length; i++) {
            if (result.files[i].rawUrl) {
              delete result.files[i].rawUrl;
            }
          }
        }
        if (result && result.contested !== null && result.contested.content) {
          delete result.contested.content;
        }
        if (result && result.forward !== null && result.forward.content) {
          delete result.forward.content;
        }
        return res.status(200).json(result);
      }
    } catch (e) {
      return res
        .status(500)
        .json({ route: `${req.method} ${req.path}`, errors: [{ msg: 'Internal Server Error', error: e.message }] });
    }
  },
);

function getFile(decision, fileId) {
  let file = null;
  if (decision && decision.files && Array.isArray(decision.files)) {
    for (let i = 0; i < decision.files.length; i++) {
      if (decision.files[i].id === fileId) {
        file = decision.files[i];
        break;
      }
    }
  }
  return file;
}

async function getDecision(query) {
  return await Elastic.decision(query);
}

module.exports = api;
