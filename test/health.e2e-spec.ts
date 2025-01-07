import { HttpStatus, INestApplication } from '@nestjs/common';
import supertest from 'supertest';

import { bootstrapApp, initializeIntegreSQL } from './tests-hooks';

describe('HealthController (e2e)', () => {
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
    await app.close();
  });

  it('/health (GET)', async () => {
    await request
      .get('/health')
      .expect(HttpStatus.OK)
      .expect((response) =>
        expect(response.body).toMatchObject(
          expect.objectContaining({
            details: {
              db: {
                status: expect.stringMatching(/up/i),
              },
              mem_rss: {
                status: expect.stringMatching(/up/i),
              },
              storage: {
                status: expect.stringMatching(/up/i),
              },
              'nestjs-docs': {
                status: expect.stringMatching(/up/i),
              },
            },
            error: {},
            info: {
              db: {
                status: expect.stringMatching(/up/i),
              },
              mem_rss: {
                status: expect.stringMatching(/up/i),
              },
              storage: {
                status: expect.stringMatching(/up/i),
              },
              'nestjs-docs': {
                status: expect.stringMatching(/up/i),
              },
            },
            status: 'ok',
          }),
        ),
      );
  });
});
