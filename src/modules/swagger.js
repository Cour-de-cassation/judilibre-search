require('../modules/env');

const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Judilibre Search API',
        description: 'Moteur de recherche Judilibre',
    },
    host: 'localhost:8080'
};

const outputFile = './swagger.json';
const routes = [
    '../api/decision.js',
    '../api/export.js',
    '../api/scan.js',
    '../api/healthcheck.js',
    '../api/search.js',
    '../api/stats.js',
    '../api/taxonomy.js',
    '../api/published.js',
    '../api/transactionalhistory.js',
    '../api/metrics.js',
];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);