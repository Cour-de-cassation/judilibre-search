const request = require('supertest');
require('../modules/env').disableElastic();
const Server = require('../modules/server');
const taxons = require('../taxons');

describe('Testing /healthcheck endpoint', () => {
  it('GET /healthcheck in test mode should return a "indisponible" status.', async () => {
    const { body, statusCode } = await request(Server.app).get('/healthcheck');
    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      status: 'indisponible',
      reason: "Cannot read property 'ping' of undefined",
    });
  });
});
