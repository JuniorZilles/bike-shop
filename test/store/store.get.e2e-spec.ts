import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import StoreModule from '../../src/store/store.module';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import Store from '../../src/store/entities/store.entity';
import { storeNotFound } from '../../src/utils/constants/errorMessages';

describe('Store GET (e2e)', () => {
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

  it('/store (GET) with valid ID should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/store/${body.storeId}`);
    expect(result.status).toBe(200);
  });

  it('/store (GET) with valid ID should return store data', async () => {
    const result = await request(app.getHttpServer()).get(`/store/${body.storeId}`);
    const store = result.body;

    expect(store.storeId).toBe(body.storeId);
    expect(store.email).toBe(storeData.email);
    expect(store.displayName).toBe(storeData.displayName);
    expect(store.city).toBe(storeData.city);
    expect(store.phone).toBe(storeData.phone);
    expect(store.complement).toBe(storeData.complement);
    expect(store.latitude).toBe(storeData.latitude);
    expect(store.longitude).toBe(storeData.longitude);
    expect(store.neighborhood).toBe(storeData.neighborhood);
    expect(store.number).toBe(storeData.number);
    expect(store.state).toBe(storeData.state);
    expect(store.street).toBe(storeData.street);
    expect(store.isActive).toBe(body.isActive);
  });

  it('/store (GET) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/store/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/store (GET) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).get('/store/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/store (GET) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).get('/store/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/store (GET) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).get('/store/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(storeNotFound);
  });
});
