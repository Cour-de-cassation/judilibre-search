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


module.exports.requestCountMiddleWare = (req, res, next) => {
  const req_url = new URL(req.url, `http://${req.headers.host}`);
  const original_res_send_function = res.send;
  const res_send_interceptor = function (body) {
    http_request_total.inc(
      {
        method: req.method,
        route: req_url.pathname,
        status_code: res.statusCode,
      }
    );
    original_res_send_function.call(this, body);
  };
  res.send = res_send_interceptor;
  next();
}

module.exports.requestDurationMiddleWare = (req, res, next) => {
  const end = http_request_duration_seconds.startTimer({ method: req.method });
  res.on("finish", () => {
    const req_url = new URL(req.url, `http://${req.headers.host}`);
    end({ route: req_url.pathname,  status_code: res.statusCode });
  });
  next();
}

module.exports.register = register;
