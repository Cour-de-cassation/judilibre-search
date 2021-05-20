const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const express = require('express');
const cors = require('cors');

class Server {
  constructor() {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '..', '..', 'public')));
    this.app.use(require(path.join(__dirname, '..', 'api')));
    this.started = false;
  }

  start() {
    if (this.started === false) {
      this.started = true;
      this.app.listen(process.env.API_PORT, () => {
        console.log(`JUDILIBRE.Server - Start 'search' server on port ${process.env.API_PORT}.`);
      });
    } else {
      throw new Error('JUDILIBRE.Server: already started.');
    }
  }
}

module.exports = new Server();
