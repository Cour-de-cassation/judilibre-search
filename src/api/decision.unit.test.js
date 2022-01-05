const request = require('supertest');
require('../modules/env').disableElastic();
const Server = require('../modules/server');
const taxons = require('../taxons');

describe('Testing /decision endpoint basic validation', () => {
  it('GET /decision without an "id" parameter must fail', async () => {
    const { body, statusCode } = await request(Server.app).get('/decision');
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /decision`,
      errors: [
        {
          location: 'query',
          msg: 'Value of the id parameter must be a string.',
          param: 'id',
        },
      ],
    });
  });

  it('GET /decision with an invalid "id" parameter must fail', async () => {
    const { body, statusCode } = await request(Server.app).get('/decision?id[]=foobar');
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /decision`,
      errors: [
        {
          location: 'query',
          msg: 'Value of the id parameter must be a string.',
          param: 'id',
          value: ['foobar'],
        },
      ],
    });
  });

  it('GET /decision with an "id" parameter should pass', async () => {
    const { statusCode } = await request(Server.app).get('/decision?id=foobar');
    expect(statusCode).toEqual(200);
  });

  it('GET /decision with a wrong "query" parameter must fail', async () => {
    const { statusCode, body } = await request(Server.app).get('/decision?id=foobar&query[]=foo');
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /decision`,
      errors: [
        {
          location: 'query',
          msg: `Value of the query parameter must be a string.`,
          param: 'query',
          value: ['foo'],
        },
      ],
    });
  });

  it('GET /decision with a "query" parameter longer than 512 chars must fail', async () => {
    const tooLongQuery =
      'He7qju8Igtf3MJHRMf75GtQydM6WD3ba5M12yDEbJJs3tKaVeKlZoY9rE0O5gMLgq4Crf257x4mCbACNY6cxvPG9WN9dbazyHsoFuoLVFXZCn8Bzro8B9Di6MglTfg7TmdtplSwHWcTLeOHYlaKpNRS61hj5A4ZORDeTGC0ePQB6dnOi9T3X4XoaLRz83Y0SidPUQImboyE6vFdfSqa6CCrk0brNq5qkvfOWzmjp85kPGdYLN9RGn3xuGNa54le5ZQ9xrMvL26T9Jk0Kigh6r1O7SrM7VNu1I26vsf0wRUBUarXBDsTCpGKEuj8KfgjDc87paXNP9MdmlUa1O7H4l2haD9OZlcZcSDW7NS9wlkw8jMzxvGgPcAlIwkgP6uD7cuI4Sak5krdkT8ZZ6dck1mT5MRHgKsoP1cKRUgepn1mIeh14qfvEB7kGioWwSH0cTNke5Bsbipg9wTb201CO0Eh6pEyHeRzrgSxuXnyz9Kqc0arQvt3Bn7pq3qogSKeZY';
    const { body, statusCode } = await request(Server.app).get(`/decision?id=foobar&query=${tooLongQuery}`);
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /decision`,
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

  it('GET /decision with a "query" parameter shorter than 512 chars should pass', async () => {
    const { statusCode } = await request(Server.app).get(`/decision?id=foobar&query=foobar`);
    expect(statusCode).toEqual(200);
  });

  it('GET /decision with a wrong "operator" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/decision?id=foobar&operator=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /decision`,
      errors: [
        {
          location: 'query',
          msg: `Value of the operator parameter must be in [${taxons.operator.keys}].`,
          param: 'operator',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/decision?id=foobar&operator[]=and');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /decision`,
      errors: [
        {
          location: 'query',
          msg: `Value of the operator parameter must be in [${taxons.operator.keys}].`,
          param: 'operator',
          value: ['and'],
        },
      ],
    });
  });

  it('GET /decision with a good "operator" parameter should pass', async () => {
    const { statusCode } = await request(Server.app).get(`/decision?id=foobar&operator=exact`);
    expect(statusCode).toEqual(200);
  });

  it('GET /decision with a non boolean "resolve_references" parameter must fail', async () => {
    const { body, statusCode } = await request(Server.app).get('/decision?id=foobar&resolve_references=foo');
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /decision`,
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

  it('GET /decision with a boolean "resolve_references" parameter should pass', async () => {
    const { statusCode } = await request(Server.app).get(`/decision?id=foobar&resolve_references=true`);
    expect(statusCode).toEqual(200);
  });
});

describe('Testing /decision endpoint on static dataset', () => {
  it('GET /decision should return the same base content no matter what the "id" parameter is', async () => {
    const baseObject = {
      decision_date: '2020-11-18',
      ecli: 'ECLI:FR:CCASS:2020:CO00740',
      number: '19-19.463',
      zones: {
        introduction: [
          {
            start: 0,
            end: 41508,
          },
        ],
        expose: [
          {
            start: 41508,
            end: 42538,
          },
        ],
        moyens: [
          {
            start: 42538,
            end: 43434,
          },
          {
            start: 43783,
            end: 45612,
          },
        ],
        motivations: [
          {
            start: 43434,
            end: 43783,
          },
          {
            start: 45612,
            end: 46458,
          },
        ],
        dispositif: [
          {
            start: 46458,
            end: 47082,
          },
        ],
        annexes: [
          {
            start: 47082,
            end: 60689,
          },
        ],
      },
    };
    const test = await request(Server.app).get(`/decision?id=foobar`);
    expect(test.statusCode).toEqual(200);
    baseObject.id = 'foobar';
    expect(test.body).toEqual(expect.objectContaining(baseObject));
    const test2 = await request(Server.app).get(`/decision?id=5fca25d9cbbf603303c4ff89`);
    expect(test2.statusCode).toEqual(200);
    baseObject.id = '5fca25d9cbbf603303c4ff89';
    expect(test2.body).toEqual(expect.objectContaining(baseObject));
  });

  it('GET /decision with a falsy "resolve_references" parameter must return an unresolved content', async () => {
    const baseObject = {
      chamber: 'comm',
      jurisdiction: 'cc',
      publication: ['b'],
      solution: 'rejet',
      type: 'other',
      formation: 'fs',
    };
    const test1 = await request(Server.app).get(`/decision?id=foobar&resolve_references=false`);
    expect(test1.statusCode).toEqual(200);
    expect(test1.body).toEqual(expect.objectContaining(baseObject));
    const test2 = await request(Server.app).get(`/decision?id=foobar&`);
    expect(test2.statusCode).toEqual(200);
    expect(test2.body).toEqual(expect.objectContaining(baseObject));
  });

  it('GET /decision with a truthy "resolve_references" parameter must return a resolved content', async () => {
    const baseObject = {
      chamber: 'Chambre commerciale financière et économique',
      jurisdiction: 'Cour de cassation',
      publication: ['Publié au Bulletin'],
      solution: 'Rejet',
      type: 'Autre',
      formation: 'Formation de section',
    };
    const test1 = await request(Server.app).get(`/decision?id=foobar&resolve_references=true`);
    expect(test1.statusCode).toEqual(200);
    expect(test1.body).toEqual(expect.objectContaining(baseObject));
    const test2 = await request(Server.app).get(`/decision?id=foobar&resolve_references=1`);
    expect(test2.statusCode).toEqual(200);
    expect(test2.body).toEqual(expect.objectContaining(baseObject));
  });
});
