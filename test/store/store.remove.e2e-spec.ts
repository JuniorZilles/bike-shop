import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import StoreModule from '../../src/store/store.module';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import Store from '../../src/store/entities/store.entity';
import { storeNotFound } from '../../src/utils/constants/errorMessages';

describe('Store REMOVE (e2e)', () => {
  let app: INestApplication;
  const storeData = validStore();
  let body: Store;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StoreModule, DatabaseModule]
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

    const result = await request(app.getHttpServer()).post('/store').send(storeData);
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/store (DELETE) with valid ID should return status 204', async () => {
    const result = await request(app.getHttpServer()).delete(`/store/${body.storeId}`);
    expect(result.status).toBe(204);
  });

  it('/store (DELETE) with valid ID should return empty body', async () => {
    const result = await request(app.getHttpServer()).delete(`/store/${body.storeId}`);
    expect(result.body).toEqual({});
  });

  it('/store (DELETE) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).delete('/store/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/store (DELETE) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).delete('/store/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/store (DELETE) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).delete('/store/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/store (DELETE) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).delete('/store/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(storeNotFound);
  });
});
