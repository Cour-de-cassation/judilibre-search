class Env {
  constructor() {
    require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
  }

  disableElastic() {
    process.env.WITHOUT_ELASTIC = true;
  }

  enableElastic() {
    process.env.WITHOUT_ELASTIC = false;
  }
}

module.exports = new Env();
