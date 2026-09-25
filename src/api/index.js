const apis = [];

apis.push(require('./decision'));
apis.push(require('./export'));
apis.push(require('./scan'));
apis.push(require('./healthcheck'));
apis.push(require('./search'));
if(!!process.env.ENV && ['LOCAL', 'DEV', 'PREPROD'].includes(process.env.ENV)) apis.push(require('./search_experimental'));
apis.push(require('./stats'));
apis.push(require('./taxonomy'));
apis.push(require('./published'));
apis.push(require('./transactionalhistory'));
apis.push(require('./metrics'));

module.exports = apis;
