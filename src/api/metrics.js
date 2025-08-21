require("../modules/env")
const { register }= require("../modules/metricsCollector")
const express = require('express');
const api = express.Router();


api.get("/metrics", async (req, res, next) => {
  res.setHeader("Content-type", register.contentType);
  res.send(await register.metrics());
  next();
});

module.exports = api;