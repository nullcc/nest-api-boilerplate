import { HttpStatus, INestApplication } from '@nestjs/common';
import supertest from 'supertest';
import * as _ from 'lodash';

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

  it('should get "ThrottlerException"', async () => {
    for (const i of _.range(1, 12)) {
      if (i <= 10) {
        await request.get('/health').expect(HttpStatus.OK);
      } else {
        if (i === 11) {
          await request
            .get('/health')
            .expect(HttpStatus.TOO_MANY_REQUESTS)
            .expect((response) =>
              expect(response.body).toEqual({
                message: 'ThrottlerException: Too Many Requests',
                statusCode: 429,
              }),
            );
        }
      }
    }
  });
});
