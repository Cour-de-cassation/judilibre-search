const request = require('supertest');
require('../modules/env').disableElastic();
const Server = require('../modules/server');
const taxons = require('../taxons');

describe('Testing /search endpoint basic validation', () => {
  it('GET /search without any parameter should pass', async () => {
    const { statusCode } = await request(Server.app).get('/search');
    expect(statusCode).toEqual(200);
  });

  it('GET /search with a wrong "query" parameter must fail', async () => {
    const { statusCode, body } = await request(Server.app).get('/search?query[]=foo');
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /search`,
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

  it('GET /search with a wrong "solution" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?solution=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the solution parameter must be in [${taxons.solution.keys}].`,
          param: 'solution[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?solution[]=cassation&solution[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the solution parameter must be in [${taxons.solution.keys}].`,
          param: 'solution[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /search with a good "solution" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?solution=cassation`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?solution[]=cassation&solution[]=rejet`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "date_start" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?date_start=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13).',
          param: 'date_start',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?date_start=2021-20-31');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13).',
          param: 'date_start',
          value: '2021-20-31',
        },
      ],
    });
    const test3 = await request(Server.app).get('/search?date_start[]=2021-05-13');
    expect(test3.statusCode).toEqual(400);
    expect(test3.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13).',
          param: 'date_start',
          value: ['2021-05-13'],
        },
      ],
    });
    const test4 = await request(Server.app).get('/search?date_start=2018');
    expect(test4.statusCode).toEqual(400);
    expect(test4.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13).',
          param: 'date_start',
          value: '2018',
        },
      ],
    });
  });

  it('GET /search with a good "date_start" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?date_start=2021-07-27`);
    expect(test1.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "date_end" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?date_end=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13).',
          param: 'date_end',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?date_end=6666-66-66');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13).',
          param: 'date_end',
          value: '6666-66-66',
        },
      ],
    });
    const test3 = await request(Server.app).get('/search?date_end[]=2021-05-13');
    expect(test3.statusCode).toEqual(400);
    expect(test3.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13).',
          param: 'date_end',
          value: ['2021-05-13'],
        },
      ],
    });
    const test4 = await request(Server.app).get('/search?date_end=2018');
    expect(test4.statusCode).toEqual(400);
    expect(test4.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13).',
          param: 'date_end',
          value: '2018',
        },
      ],
    });
  });

  it('GET /search with a good "date_end" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?date_end=2021-05-13`);
    expect(test1.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "sort" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?sort=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the sort parameter must be in [${taxons.sort.keys}].`,
          param: 'sort',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?sort[]=score');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the sort parameter must be in [${taxons.sort.keys}].`,
          param: 'sort',
          value: ['score'],
        },
      ],
    });
  });

  it('GET /search with a good "sort" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?sort=score`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?sort=date`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "order" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?order=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the order parameter must be in [${taxons.order.keys}].`,
          param: 'order',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?order[]=asc');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the order parameter must be in [${taxons.order.keys}].`,
          param: 'order',
          value: ['asc'],
        },
      ],
    });
  });

  it('GET /search with a good "order" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?order=asc`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?order=desc`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "page_size" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?page_size=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the page_size parameter must be an integer between 1 and 50.`,
          param: 'page_size',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?page_size=0');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the page_size parameter must be an integer between 1 and 50.`,
          param: 'page_size',
          value: '0',
        },
      ],
    });
    const test3 = await request(Server.app).get('/search?page_size=6666');
    expect(test3.statusCode).toEqual(400);
    expect(test3.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the page_size parameter must be an integer between 1 and 50.`,
          param: 'page_size',
          value: '6666',
        },
      ],
    });
    const test4 = await request(Server.app).get('/search?page=333&page_size=30');
    expect(test4.statusCode).toEqual(416);
    expect(test4.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          msg: `Range Not Satisfiable`,
        },
      ],
    });
  });

  it('GET /search with a good "page_size" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?page_size=10`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?page_size=50`);
    expect(test2.statusCode).toEqual(200);
    const test3 = await request(Server.app).get(`/search?page_size[]=42`);
    expect(test3.statusCode).toEqual(200);
  });

  it('GET /search with a wrong "page" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/search?page=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the page parameter must be an integer greater or equal than 0.`,
          param: 'page',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/search?page=-10');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /search`,
      errors: [
        {
          location: 'query',
          msg: `Value of the page parameter must be an integer greater or equal than 0.`,
          param: 'page',
          value: '-10',
        },
      ],
    });
  });

  it('GET /search with a good "page" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/search?page=0`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/search?page=100`);
    expect(test2.statusCode).toEqual(200);
    const test3 = await request(Server.app).get(`/search?page[]=42`);
    expect(test3.statusCode).toEqual(200);
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

describe('Testing /search endpoint on static dataset', () => {
  it('GET /search with an empty query must return an empty result', async () => {
    const baseObject = {
      max_score: 0,
      next_page: null,
      page: 0,
      page_size: 10,
      previous_page: null,
      total: 0,
      results: [],
    };
    const test1 = await request(Server.app).get(`/search`);
    expect(test1.statusCode).toEqual(200);
    expect(test1.body).toEqual(expect.objectContaining(baseObject));
    const test2 = await request(Server.app).get(`/search?query=&`);
    expect(test2.statusCode).toEqual(200);
    expect(test2.body).toEqual(expect.objectContaining(baseObject));
  });

  it('GET /search with a falsy "resolve_references" parameter must return an unresolved content', async () => {
    const baseObject = {
      chamber: 'soc',
      jurisdiction: 'cc',
      publication: ['b', 'c'],
      solution: 'rejet',
      type: 'other',
      formation: 'fs',
    };
    const test1 = await request(Server.app).get(`/search?query=foo&resolve_references=false`);
    expect(test1.statusCode).toEqual(200);
    expect(test1.body).toEqual(
      expect.objectContaining({
        max_score: 10,
        next_page:
          'query=foo&resolve_references=false&field=&type=&theme=&chamber=&formation=&jurisdiction=&committee=&publication=&solution=&page=1',
        page: 0,
        page_size: 10,
        previous_page: null,
        total: 928,
      }),
    );
    expect(test1.body.results).toHaveLength(10);
    expect(test1.body.results[0]).toEqual(expect.objectContaining(baseObject));
    const test2 = await request(Server.app).get(`/search?query=foo&`);
    expect(test2.statusCode).toEqual(200);
    expect(test2.body).toEqual(
      expect.objectContaining({
        max_score: 10,
        next_page:
          'query=foo&field=&type=&theme=&chamber=&formation=&jurisdiction=&committee=&publication=&solution=&page=1',
        page: 0,
        page_size: 10,
        previous_page: null,
        total: 928,
      }),
    );
    expect(test2.body.results).toHaveLength(10);
    expect(test2.body.results[0]).toEqual(expect.objectContaining(baseObject));
  });

  it('GET /search with a truthy "resolve_references" parameter must return a resolved content', async () => {
    const baseObject = {
      chamber: 'Chambre sociale',
      jurisdiction: 'Cour de cassation',
      publication: ['Publié au Bulletin', 'Communiqué'],
      solution: 'Rejet',
      type: 'Arrêt',
      formation: 'Formation de section',
    };
    const test1 = await request(Server.app).get(`/search?query=foo&resolve_references=true`);
    expect(test1.statusCode).toEqual(200);
    expect(test1.body).toEqual(
      expect.objectContaining({
        max_score: 10,
        next_page:
          'query=foo&resolve_references=true&field=&type=&theme=&chamber=&formation=&jurisdiction=&committee=&publication=&solution=&page=1',
        page: 0,
        page_size: 10,
        previous_page: null,
        total: 928,
      }),
    );
    expect(test1.body.results).toHaveLength(10);
    expect(test1.body.results[0]).toEqual(expect.objectContaining(baseObject));
    const test2 = await request(Server.app).get(`/search?query=foo&resolve_references=1`);
    expect(test2.statusCode).toEqual(200);
    expect(test2.body).toEqual(
      expect.objectContaining({
        max_score: 10,
        next_page:
          'query=foo&resolve_references=true&field=&type=&theme=&chamber=&formation=&jurisdiction=&committee=&publication=&solution=&page=1',
        page: 0,
        page_size: 10,
        previous_page: null,
        total: 928,
      }),
    );
    expect(test2.body.results).toHaveLength(10);
    expect(test2.body.results[0]).toEqual(expect.objectContaining(baseObject));
  });
});
