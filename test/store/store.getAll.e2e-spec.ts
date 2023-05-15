import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import StoreModule from '../../src/store/store.module';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import Store from '../../src/store/entities/store.entity';

describe('Store GET ALL (e2e)', () => {
  let app: INestApplication;
  const storeData = validStore();
  let body: Store;
  let count: number;

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
    const promises = [];

    for (let i = 0; i < 10; i += 1) {
      const data = validStore();
      promises.push(request(app.getHttpServer()).post('/store').send(data));
    }
    const responses = await Promise.all(promises);
    count = responses.map((element) => element.status === 200).length + 1;
    const result = await request(app.getHttpServer()).post('/store').send(storeData);
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/store (GET) should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/store');
    expect(result.status).toBe(200);
  });

  it(`/store (GET) should return all ${count} stores inserted`, async () => {
    const result = await request(app.getHttpServer()).get('/store');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/store (GET) with limit 1 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/store?limit=1');
    expect(result.status).toBe(200);
  });

  it('/store (GET) with limit 1 should return 1 store', async () => {
    const result = await request(app.getHttpServer()).get('/store?limit=1');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/store (GET) with limit 1 and offset 2 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/store?limit=1&offset=2');
    expect(result.status).toBe(200);
  });

  it('/store (GET) with limit 1 and offset 2 should return 1 store', async () => {
    const result = await request(app.getHttpServer()).get('/store?limit=1&offset=2');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(2);
    expect(result.body.items).toHaveLength(1);
  });

  it('/store (GET) with search by email should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/store?email=${body.email}`);
    expect(result.status).toBe(200);
  });

  it('/store (GET) with search by email should return 1 store', async () => {
    const result = await request(app.getHttpServer()).get(`/store?email=${body.email}`);
    expect(result.body.totalResults).toBe(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/store (GET) with search by email should return the store that has the email', async () => {
    const result = await request(app.getHttpServer()).get(`/store?email=${body.email}`);
    expect(result.body.items[0].email).toBe(body.email);
  });

  it('/store (GET) with search by part of displayName should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/store?displayName=${body.displayName.split(' ')[0]}`);
    expect(result.status).toBe(200);
  });

  it('/store (GET) with search by part of displayName should return at least one store', async () => {
    const result = await request(app.getHttpServer()).get(`/store?displayName=${body.displayName.split(' ')[0]}`);
    expect(result.body.totalResults).toBeGreaterThanOrEqual(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items.length).toBeGreaterThanOrEqual(1);
  });

  it('/store (GET) with search by part of displayName should return the stores that have the same part displayName', async () => {
    const partName = body.displayName.split(' ')[0];
    const result = await request(app.getHttpServer()).get(`/store?displayName=${partName}`);
    result.body.items.forEach((element: Store) => {
      expect(element.displayName).toContain(partName);
    });
  });

  it('/store (GET) with email that doesnt exist should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/store?email=john.doe@mail.com');
    expect(result.status).toBe(200);
  });

  it('/store (GET) with email that doesnt exist should return no store', async () => {
    const result = await request(app.getHttpServer()).get('/store?email=john.doe@mail.com');
    expect(result.body.totalResults).toBe(0);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(0);
  });

  it('/store (GET) with invalid limit should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/store?limit=af');
    expect(result.status).toBe(400);
  });

  it('/store (GET) with invalid limit should return the validation error', async () => {
    const result = await request(app.getHttpServer()).get('/store?limit=af');
    expect(result.body.message).toEqual(['limit must be a number conforming to the specified constraints']);
    expect(result.body.statusCode).toBe(400);
    expect(result.body.error).toBe('Bad Request');
  });
});
