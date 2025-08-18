require("../modules/env")
const express = require('express');
const api = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const client = require("prom-client")
const register = new client.Registry();
client.collectDefaultMetrics(
  { 
    register: register,
    prefix: `judilibre_`,
    }
  );

api.get("/metrics", async (req, res, next) => {
  res.setHeader("Content-type", register.contentType);
  res.send(await register.metrics());
  next();
});

module.exports = api;