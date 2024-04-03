const apis = [];

apis.push(require('./decision'));
apis.push(require('./export'));
apis.push(require('./healthcheck'));
apis.push(require('./search'));
apis.push(require('./stats'));
apis.push(require('./taxonomy'));
apis.push(require('./published'));

module.exports = apis;
