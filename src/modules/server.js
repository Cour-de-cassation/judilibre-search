require('./env');
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

class Server {
  constructor() {
    this.app = express();
    this.app.use(morgan('combined'));
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true }));
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
