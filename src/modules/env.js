class Env {
  constructor() {
    require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
  }
}

module.exports = new Env();
