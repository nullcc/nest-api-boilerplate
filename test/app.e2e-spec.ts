import { HttpStatus, INestApplication } from '@nestjs/common';
import supertest from 'supertest';

import { bootstrapApp, initializeIntegreSQL } from './tests-hooks';

describe('AppController (e2e)', () => {
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

  it('/ (GET)', async () => {
    await request
      .get('/')
      .expect(HttpStatus.OK)
      .expect((response) =>
        expect(response.text).toContain('Hello, nest api boilerplate!'),
      );
  });
});
