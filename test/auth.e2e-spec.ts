import { faker } from '@faker-js/faker';
import { build, perBuild } from '@jackfranklin/test-data-bot';
import { HttpStatus, INestApplication } from '@nestjs/common';
import supertest from 'supertest';

import { bootstrapApp, initializeIntegreSQL } from './tests-hooks';

const userBuilder = build({
  fields: {
    name: perBuild(() => faker.person.fullName()),
    email: perBuild(() => faker.internet.exampleEmail()),
    password: 'Pa$$w0rd',
  },
});

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let request;
  let hash: string;

  beforeAll(async () => {
    hash = await initializeIntegreSQL();
  });

  beforeEach(async () => {
    app = await bootstrapApp(hash);
    request = supertest(app.getHttpServer());
  });

  afterEach(async () => {
    await app?.close();
  });

  it.each([
    ['/auth/register', userBuilder(), HttpStatus.CREATED],
    [
      '/auth/login',
      {
        email: 'john@doe.me',
        password: '12345678',
      },
      HttpStatus.OK,
    ],
    [
      '/auth/register',
      { name: null, email: null, password: null },
      HttpStatus.UNPROCESSABLE_ENTITY,
    ],
    ['/auth/login', { email: '', password: '' }, HttpStatus.UNAUTHORIZED],
    [
      '/auth/login',
      { email: 'john@doe.me', password: '' },
      HttpStatus.UNAUTHORIZED,
    ],
  ])(
    'should make a POST request to %s with %p and expect %d status',
    async (url, body, statusCode) => {
      const resp = await request.post(url).send(body).expect(statusCode);

      expect(resp.body).toBeDefined();
      expect(resp.body.password).toBeUndefined();
      if (resp.ok) expect(resp.header.authorization).toMatch(/Bearer\s+.*/);
    },
  );

  it('should get authenticated user', async () => {
    const {
      header: { authorization },
    } = await request
      .post('/auth/login')
      .send({
        email: 'john@doe.me',
        password: '12345678',
      })
      .expect(HttpStatus.OK);
    const resp = await request
      .get('/auth/me')
      .set('Authorization', authorization);

    expect(resp.body).toBeDefined();
    expect(resp.body.password).toBeUndefined();
  });
});
