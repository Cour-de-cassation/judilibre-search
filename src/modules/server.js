require('./env');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { register, http_request_total, http_request_duration_seconds } = require('./metricsCollector')

class Server {
  constructor() {
    this.app = express();
    this.app.use(morgan('combined'));
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use((req, res, next) => {
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
    });
    this.app.use((req, res, next) => {
      const end = http_request_duration_seconds.startTimer({ method: req.method });
      res.on("finish", () => {
        const req_url = new URL(req.url, `http://${req.headers.host}`);
        end({ route: req_url.pathname,  status_code: res.statusCode });
      });
      next();
    });
    this.app.use((req, res, next) => {
      res.setHeader('X-Powered-By', false);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'deny');
      res.setHeader('Content-Security-Policy', "default-src 'none'");
      next();
    });
    this.app.use(express.static(path.join(__dirname, '..', '..', 'public')));
    this.app.use((err, req, res, next) => {
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res
          .status(400)
          .json({ route: `${req.method} ${req.path}`, errors: [{ msg: 'Bad request.', err: err.message }] });
      }
      next();
    });
    this.app.use(require(path.join(__dirname, '..', 'api')));
    this.started = false;
  }

  start() {
    if (this.started === false) {
      this.started = true;
      this.app.listen(process.env.API_PORT, () => {
        console.log(`${process.env.APP_ID}.Server: Start server on port ${process.env.API_PORT}.`);
      });
    } else {
      throw new Error(`${process.env.APP_ID}.Server: Server already started.`);
    }
  }
}

module.exports = new Server();
