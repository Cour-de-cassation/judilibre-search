require('../modules/env');
const express = require('express');
const api = express.Router();
const Elastic = require('../modules/elastic');
const route = 'healthcheck';

api.get(`/${route}`, async (req, res) => {
  try {
    const result = await getHealthcheck(req.query);
    return res.status(200).json(result);
  } catch (e) {
    return res.status(200).json({
      status: 'indisponible',
      reason: JSON.stringify(e, e ? Object.getOwnPropertyNames(e) : null),
    });
  }
});

async function getHealthcheck(query) {
  const ping = await Elastic.client.ping({});
  if (ping.body === true && ping.statusCode === 200) {
    return {
      status: 'disponible',
    };
  } else {
    return {
      status: 'indisponible',
    };
  }
}

module.exports = api;
