const request = require('supertest');
require('../modules/env').disableElastic();
const Server = require('../modules/server');
const taxons = require('../taxons');

describe('Testing /search endpoint basic validation', () => {
  it('GET /search withoutout any parameter must pass', async () => {
    const { statusCode } = await request(Server.app).get('/search');
    expect(statusCode).toEqual(200);
  });

  it('GET /search with a "query" parameter longer than 512 chars must fail', async () => {
    const tooLongQuery =
      'He7qju8Igtf3MJHRMf75GtQydM6WD3ba5M12yDEbJJs3tKaVeKlZoY9rE0O5gMLgq4Crf257x4mCbACNY6cxvPG9WN9dbazyHsoFuoLVFXZCn8Bzro8B9Di6MglTfg7TmdtplSwHWcTLeOHYlaKpNRS61hj5A4ZORDeTGC0ePQB6dnOi9T3X4XoaLRz83Y0SidPUQImboyE6vFdfSqa6CCrk0brNq5qkvfOWzmjp85kPGdYLN9RGn3xuGNa54le5ZQ9xrMvL26T9Jk0Kigh6r1O7SrM7VNu1I26vsf0wRUBUarXBDsTCpGKEuj8KfgjDc87paXNP9MdmlUa1O7H4l2haD9OZlcZcSDW7NS9wlkw8jMzxvGgPcAlIwkgP6uD7cuI4Sak5krdkT8ZZ6dck1mT5MRHgKsoP1cKRUgepn1mIeh14qfvEB7kGioWwSH0cTNke5Bsbipg9wTb201CO0Eh6pEyHeRzrgSxuXnyz9Kqc0arQvt3Bn7pq3qogSKeZY';
    const { body, statusCode } = await request(Server.app).get(`/search?query=${tooLongQuery}`);
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'The query parameter must not contain more than 512 characters.',
          param: 'query',
          value: tooLongQuery,
        },
      ],
    });
  });

  it('GET /search with a "query" parameter shorter than 512 chars should pass', async () => {
    const { statusCode } = await request(Server.app).get(`/search?query=foobar`);
    expect(statusCode).toEqual(200);
  });

  it('GET /search with a wrong "field" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?field=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the field parameter must be in [${taxons.field.keys}].`,
          param: 'field[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?field[]=expose&field[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the field parameter must be in [${taxons.field.keys}].`,
          param: 'field[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /search with a good "field" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?field=expose`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?field[]=expose&field[]=introduction`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "operator" parameter must fail', async () => {
    const { body, statusCode } = await request(Server.app).get('/search?operator=foo');
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the operator parameter must be in [${taxons.operator.keys}].`,
          param: 'operator',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /search with a good "operator" parameter should pass', async () => {
    const { statusCode } = await request(Server.app).get(`/search?operator=exact`);
    expect(statusCode).toEqual(200);
  });

  it('GET /search with a wrong "type" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?type=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the type parameter must be in [${taxons.type.keys}].`,
          param: 'type[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?type[]=arret&type[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the type parameter must be in [${taxons.type.keys}].`,
          param: 'type[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /search with a good "type" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?type=arret`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?type[]=qpc&type[]=arret`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "chamber" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?chamber=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the chamber parameter must be in [${taxons.chamber.keys}].`,
          param: 'chamber[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?chamber[]=comm&chamber[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the chamber parameter must be in [${taxons.chamber.keys}].`,
          param: 'chamber[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /search with a good "chamber" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?chamber=comm`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?chamber[]=comm&chamber[]=soc`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "formation" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?formation=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the formation parameter must be in [${taxons.formation.keys}].`,
          param: 'formation[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?formation[]=fs&formation[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the formation parameter must be in [${taxons.formation.keys}].`,
          param: 'formation[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /search with a good "formation" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?formation=fs`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?formation[]=fs&formation[]=fp`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "jurisdiction" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?jurisdiction=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the jurisdiction parameter must be in [${taxons.jurisdiction.keys}].`,
          param: 'jurisdiction[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?jurisdiction[]=cc&jurisdiction[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the jurisdiction parameter must be in [${taxons.jurisdiction.keys}].`,
          param: 'jurisdiction[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /search with a good "jurisdiction" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?jurisdiction=cc`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?jurisdiction[]=cc`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "publication" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?publication=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the publication parameter must be in [${taxons.publication.keys}].`,
          param: 'publication[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?publication[]=b&publication[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the publication parameter must be in [${taxons.publication.keys}].`,
          param: 'publication[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /search with a good "publication" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?publication=b`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?publication[]=b&publication[]=l`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /search with a non boolean "resolve_references" parameter must fail', async () => {
    const { body, statusCode } = await request(Server.app).get('/search?resolve_references=foo');
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'Value of the resolve_references parameter must be a boolean.',
          param: 'resolve_references',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /search with a boolean "resolve_references" parameter should pass', async () => {
    const { statusCode } = await request(Server.app).get(`/search?resolve_references=true`);
    expect(statusCode).toEqual(200);
  });
});

describe('Testing /search endpoint on static dataset', () => {});
