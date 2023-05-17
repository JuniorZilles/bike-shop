import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import DatabaseModule from '../../src/database/database.module';
import { validPart } from '../utils/factories/part/part.factory';
import Part from '../../src/part/entities/part.entity';
import { partNotFound } from '../../src/utils/constants/errorMessages';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';

describe('Part REMOVE (e2e)', () => {
  let app: INestApplication;
  let body: Part;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StoreModule, PartModule, DatabaseModule]
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    );

    await app.init();

    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    const result = await request(app.getHttpServer()).post('/part').send(validPart(resultStore.body?.storeId));
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/part (DELETE) with valid ID should return status 204', async () => {
    const result = await request(app.getHttpServer()).delete(`/part/${body.partId}`);
    expect(result.status).toBe(204);
  });

  it('/part (DELETE) with valid ID should return empty body', async () => {
    const result = await request(app.getHttpServer()).delete(`/part/${body.partId}`);
    expect(result.body).toEqual({});
  });

  it('/part (DELETE) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).delete('/part/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/part (DELETE) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).delete('/part/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/part (DELETE) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).delete('/part/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/part (DELETE) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).delete('/part/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(partNotFound);
  });
});
