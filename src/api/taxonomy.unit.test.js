const request = require('supertest');
require('../modules/env').disableElastic();
const Server = require('../modules/server');
const taxons = require('../taxons');

describe('Testing /taxonomy endpoint basic validation', () => {
  it('GET /taxonomy without any parameter must return the list of available ids.', async () => {
    const { body, statusCode } = await request(Server.app).get('/taxonomy');
    expect(statusCode).toEqual(200);
    expect(body).toEqual({
      result: Object.keys(taxons),
    });
  });

  it('GET /taxonomy with any parameter but "id" must fail.', async () => {
    const test1 = await request(Server.app).get('/taxonomy?key=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /taxonomy`,
      errors: [
        {
          value: '',
          msg: 'The id parameter is required.',
          param: 'id',
          location: 'query',
        },
      ],
    });
    const test2 = await request(Server.app).get('/taxonomy?value=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /taxonomy`,
      errors: [
        {
          value: '',
          msg: 'The id parameter is required.',
          param: 'id',
          location: 'query',
        },
      ],
    });
    const test3 = await request(Server.app).get('/taxonomy?context_value=foo');
    expect(test3.statusCode).toEqual(400);
    expect(test3.body).toEqual({
      route: `GET /taxonomy`,
      errors: [
        {
          value: '',
          msg: 'The id parameter is required.',
          param: 'id',
          location: 'query',
        },
      ],
    });
  });

  it('GET /taxonomy with a wrong "id" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/taxonomy?id=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /taxonomy`,
      errors: [
        {
          value: 'foo',
          msg: `Value of the id parameter must be in [${Object.keys(taxons)}].`,
          param: 'id',
          location: 'query',
        },
      ],
    });
    const test2 = await request(Server.app).get('/taxonomy?id[]=publication');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /taxonomy`,
      errors: [
        {
          value: ['publication'],
          msg: `Value of the id parameter must be a string.`,
          param: 'id',
          location: 'query',
        },
      ],
    });
  });

  it('GET /taxonomy with a wrong "key" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/taxonomy?id=publication&key=z');
    expect(test1.statusCode).toEqual(404);
    expect(test1.body).toEqual({
      route: `GET /taxonomy`,
      errors: [
        {
          value: 'z',
          msg: "Value not found for the given key parameter in 'publication'.",
          param: 'key',
          location: 'query',
        },
      ],
    });
    const test2 = await request(Server.app).get('/taxonomy?id=publication&key[]=b');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /taxonomy`,
      errors: [
        {
          value: ['b'],
          msg: `Value of the key parameter must be a string.`,
          param: 'key',
          location: 'query',
        },
      ],
    });
  });

  it('GET /taxonomy with a good "key" parameter should pass', async () => {
    const test1 = await request(Server.app).get('/taxonomy?id=publication&key=b');
    expect(test1.statusCode).toEqual(200);
    expect(test1.body).toEqual({
      id: 'publication',
      key: 'b',
      result: {
        value: 'Publié au Bulletin',
      },
    });
    const test2 = await request(Server.app).get('/taxonomy?key=fs&id=formation');
    expect(test2.statusCode).toEqual(200);
    expect(test2.body).toEqual({
      id: 'formation',
      key: 'fs',
      result: {
        value: 'Formation de section',
      },
    });
  });

  it('GET /taxonomy with a wrong "value" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/taxonomy?id=publication&value=foobar');
    expect(test1.statusCode).toEqual(404);
    expect(test1.body).toEqual({
      route: `GET /taxonomy`,
      errors: [
        {
          value: 'foobar',
          msg: "Key not found for the given value parameter in 'publication'.",
          param: 'value',
          location: 'query',
        },
      ],
    });
    const test2 = await request(Server.app).get('/taxonomy?id=publication&value[]=Communiqu%C3%A9%20de%20presse');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /taxonomy`,
      errors: [
        {
          value: ['Communiqué de presse'],
          msg: `Value parameter must be a string.`,
          param: 'value',
          location: 'query',
        },
      ],
    });
  });

  it('GET /taxonomy with a good "value" parameter should pass', async () => {
    const test1 = await request(Server.app).get('/taxonomy?id=publication&value=Communiqu%C3%A9%20de%20presse');
    expect(test1.statusCode).toEqual(200);
    expect(test1.body).toEqual({
      id: 'publication',
      value: 'Communiqué de presse',
      result: {
        key: 'c',
      },
    });
    const test2 = await request(Server.app).get('/taxonomy?value=Formation%20de%20section&id=formation');
    expect(test2.statusCode).toEqual(200);
    expect(test2.body).toEqual({
      id: 'formation',
      value: 'Formation de section',
      result: {
        key: 'fs',
      },
    });
  });

  // @TODO context_value parameter is still ignored

  it('GET /taxonomy with any other combination of parameters must fail', async () => {
    const test1 = await request(Server.app).get('/taxonomy?id=publication&value=Communiqu%C3%A9%20de%20presse&key=c');
    expect(test1.statusCode).toEqual(500);
  });
});
