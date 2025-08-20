const prometheusClient = require("prom-client")
const register = new prometheusClient.Registry();

const http_request_total = new prometheusClient.Counter({
  name: "http_request_total",
  help: "The total number of HTTP requests received",
  labelNames: ["method", "route", "status_code"],
});

const http_request_duration_seconds = new prometheusClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
});



register.registerMetric(http_request_total);
register.registerMetric(http_request_duration_seconds);



module.exports = { register, http_request_total, http_request_duration_seconds };