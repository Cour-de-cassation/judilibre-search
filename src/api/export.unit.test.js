const request = require('supertest');
require('../modules/env').disableElastic();
const Server = require('../modules/server');
const taxons = require('../taxons');

describe('Testing /export endpoint basic validation', () => {
  it('GET /export without any parameter should fail', async () => {
    const { statusCode } = await request(Server.app).get('/export');
    expect(statusCode).toEqual(400);
  });

  it('GET /export with a wrong "type" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&type=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the type parameter must be in [${taxons.all.type.keys}].`,
          param: 'type[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&type[]=arret&type[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the type parameter must be in [${taxons.all.type.keys}].`,
          param: 'type[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /export with a good "type" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&type=arret`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=0&type[]=qpc&type[]=arret`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "chamber" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&chamber=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the chamber parameter must be in [${taxons.all.chamber.keys}].`,
          param: 'chamber[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&chamber[]=comm&chamber[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the chamber parameter must be in [${taxons.all.chamber.keys}].`,
          param: 'chamber[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /export with a good "chamber" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&chamber=comm`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=0&chamber[]=comm&chamber[]=soc`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "formation" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&formation=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the formation parameter must be in [${taxons.all.formation.keys}].`,
          param: 'formation[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&formation[]=fs&formation[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the formation parameter must be in [${taxons.all.formation.keys}].`,
          param: 'formation[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /export with a good "formation" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&formation=fs`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=0&formation[]=fs&formation[]=fp`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "jurisdiction" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&jurisdiction=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the jurisdiction parameter must be in [${taxons.all.jurisdiction.keys}].`,
          param: 'jurisdiction[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&jurisdiction[]=cc&jurisdiction[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the jurisdiction parameter must be in [${taxons.all.jurisdiction.keys}].`,
          param: 'jurisdiction[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /export with a good "jurisdiction" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&jurisdiction=cc`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=0&jurisdiction[]=cc`);
    expect(test2.statusCode).toEqual(200);
    const test3 = await request(Server.app).get(`/export?batch=0&jurisdiction=ca`);
    expect(test3.statusCode).toEqual(200);
    const test4 = await request(Server.app).get(`/export?batch=0&jurisdiction[]=ca`);
    expect(test4.statusCode).toEqual(200);
    const test5 = await request(Server.app).get(`/export?batch=0&jurisdiction[]=cc&jurisdiction[]=ca`);
    expect(test5.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "publication" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&publication=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the publication parameter must be in [${taxons.all.publication.keys}].`,
          param: 'publication[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&publication[]=b&publication[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the publication parameter must be in [${taxons.all.publication.keys}].`,
          param: 'publication[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /export with a good "publication" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&publication=b`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=0&publication[]=b&publication[]=l`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "solution" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&solution=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the solution parameter must be in [${taxons.all.solution.keys}].`,
          param: 'solution[0]',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&solution[]=cassation&solution[]=foo');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the solution parameter must be in [${taxons.all.solution.keys}].`,
          param: 'solution[1]',
          value: 'foo',
        },
      ],
    });
  });

  it('GET /export with a good "solution" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&solution=cassation`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=0&solution[]=cassation&solution[]=rejet`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "date_start" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&date_start=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
          param: 'date_start',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&date_start=2021-20-31');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
          param: 'date_start',
          value: '2021-20-31',
        },
      ],
    });
    const test3 = await request(Server.app).get('/export?batch=0&date_start[]=2021-05-13');
    expect(test3.statusCode).toEqual(400);
    expect(test3.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
          param: 'date_start',
          value: ['2021-05-13'],
        },
      ],
    });
    /*
    const test4 = await request(Server.app).get('/export?batch=0&date_start=2018');
    expect(test4.statusCode).toEqual(400);
    expect(test4.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: 'Start date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
          param: 'date_start',
          value: '2018',
        },
      ],
    });
    */
  });

  it('GET /export with a good "date_start" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&date_start=2021-07-27`);
    expect(test1.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "date_end" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&date_end=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
          param: 'date_end',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&date_end=6666-66-66');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
          param: 'date_end',
          value: '6666-66-66',
        },
      ],
    });
    const test3 = await request(Server.app).get('/export?batch=0&date_end[]=2021-05-13');
    expect(test3.statusCode).toEqual(400);
    expect(test3.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
          param: 'date_end',
          value: ['2021-05-13'],
        },
      ],
    });
    /*
    const test4 = await request(Server.app).get('/export?batch=0&date_end=2018');
    expect(test4.statusCode).toEqual(400);
    expect(test4.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: 'End date must be a valid ISO-8601 date (e.g. 2021-05-13, 2021-05-13T06:00:00Z).',
          param: 'date_end',
          value: '2018',
        },
      ],
    });
    */
  });

  it('GET /export with a good "date_end" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&date_end=2021-05-13`);
    expect(test1.statusCode).toEqual(200);
  });

  it('GET /export using legacy', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&legacy.pourvoiCcas=1`);
    expect(test1.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "date_type" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&date_type=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the date_type parameter must be in [${taxons.all.date_type.keys}].`,
          param: 'date_type',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&date_type[]=creation');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the date_type parameter must be in [${taxons.all.date_type.keys}].`,
          param: 'date_type',
          value: ['creation'],
        },
      ],
    });
  });

  it('GET /export with a good "date_type" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&date_type=creation`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=0&date_type=update`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "order" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&order=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the order parameter must be in [${taxons.all.order.keys}].`,
          param: 'order',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&order[]=asc');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the order parameter must be in [${taxons.all.order.keys}].`,
          param: 'order',
          value: ['asc'],
        },
      ],
    });
  });

  it('GET /export with a good "order" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&order=asc`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=0&order=desc`);
    expect(test2.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "batch_size" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=0&batch_size=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the batch_size parameter must be an integer between 1 and 1000.`,
          param: 'batch_size',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=0&batch_size=0');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the batch_size parameter must be an integer between 1 and 1000.`,
          param: 'batch_size',
          value: '0',
        },
      ],
    });
    const test3 = await request(Server.app).get('/export?batch=0&batch_size=6666');
    expect(test3.statusCode).toEqual(400);
    expect(test3.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the batch_size parameter must be an integer between 1 and 1000.`,
          param: 'batch_size',
          value: '6666',
        },
      ],
    });
    const test4 = await request(Server.app).get('/export?batch=333&batch_size=30');
    expect(test4.statusCode).toEqual(416);
    expect(test4.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          msg: `Range Not Satisfiable`,
        },
      ],
    });
  });

  it('GET /export with a good "batch_size" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0&batch_size=10`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=0&batch_size=50`);
    expect(test2.statusCode).toEqual(200);
    const test3 = await request(Server.app).get(`/export?batch=0&batch_size[]=42`);
    expect(test3.statusCode).toEqual(200);
  });

  it('GET /export with a wrong "batch" parameter must fail', async () => {
    const test1 = await request(Server.app).get('/export?batch=foo');
    expect(test1.statusCode).toEqual(400);
    expect(test1.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the batch parameter must be an integer greater or equal than 0.`,
          param: 'batch',
          value: 'foo',
        },
      ],
    });
    const test2 = await request(Server.app).get('/export?batch=-10');
    expect(test2.statusCode).toEqual(400);
    expect(test2.body).toEqual({
      route: `GET /export`,
      errors: [
        {
          location: 'query',
          msg: `Value of the batch parameter must be an integer greater or equal than 0.`,
          param: 'batch',
          value: '-10',
        },
      ],
    });
  });

  it('GET /export with a good "batch" parameter should pass', async () => {
    const test1 = await request(Server.app).get(`/export?batch=0`);
    expect(test1.statusCode).toEqual(200);
    const test2 = await request(Server.app).get(`/export?batch=100`);
    expect(test2.statusCode).toEqual(200);
    const test3 = await request(Server.app).get(`/export?batch[]=42`);
    expect(test3.statusCode).toEqual(200);
  });

  it('GET /export with a non boolean "resolve_references" parameter must fail', async () => {
    const { body, statusCode } = await request(Server.app).get('/export?batch=0&resolve_references=foo');
    expect(statusCode).toEqual(400);
    expect(body).toEqual({
      route: `GET /export`,
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

  it('GET /export with a boolean "resolve_references" parameter should pass', async () => {
    const { statusCode } = await request(Server.app).get(`/export?batch=0&resolve_references=true`);
    expect(statusCode).toEqual(200);
  });
});

describe('Testing /export endpoint on static dataset', () => {});
