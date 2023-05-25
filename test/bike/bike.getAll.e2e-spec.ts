import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import BikeModule from '../../src/bike/bike.module';
import { validBike } from '../utils/factories/bike/bike.factory';
import DatabaseModule from '../../src/database/database.module';
import { validClient } from '../utils/factories/client/client.factory';
import ClientModule from '../../src/client/client.module';
import Bike from '../../src/bike/entities/bike.entity';

describe('Bike GET ALL (e2e)', () => {
  let app: INestApplication;
  let clientId: string;
  let body: Bike;
  let count: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BikeModule, ClientModule, DatabaseModule]
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

    const resultClient = await request(app.getHttpServer()).post('/client').send(validClient());
    clientId = resultClient.body.clientId;
    const resultBike = await request(app.getHttpServer()).post('/bike').send(validBike(clientId));

    const promises = [];

    for (let i = 0; i < 10; i += 1) {
      promises.push(request(app.getHttpServer()).post('/bike').send(validBike(clientId)));
    }
    const responses = await Promise.all(promises);
    count = responses.filter((element) => element.status === 201).length + 1;

    body = resultBike.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/bike (GET) should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/bike');
    expect(result.status).toBe(200);
  });

  it(`/bike (GET) should return all ${count} bikes inserted`, async () => {
    const result = await request(app.getHttpServer()).get('/bike');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/bike (GET) with limit 1 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/bike?limit=1');
    expect(result.status).toBe(200);
  });

  it('/bike (GET) with limit 1 should return 1 bike', async () => {
    const result = await request(app.getHttpServer()).get('/bike?limit=1');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/bike (GET) with limit 1 and offset 2 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/bike?limit=1&offset=2');
    expect(result.status).toBe(200);
  });

  it('/bike (GET) with limit 1 and offset 2 should return 1 bike', async () => {
    const result = await request(app.getHttpServer()).get('/bike?limit=1&offset=2');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(2);
    expect(result.body.items).toHaveLength(1);
  });

  it('/bike (GET) with search by brand should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/bike?brand=${body.brand}`);
    expect(result.status).toBe(200);
  });

  it('/bike (GET) with search by brand should return at least 1 bike with that brand', async () => {
    const result = await request(app.getHttpServer()).get(`/bike?brand=${body.brand}`);
    result.body.items.forEach((e) => {
      expect(e.brand).toBe(body.brand);
    });
  });

  it('/bike (GET) with search by brand should return at least 1 bike', async () => {
    const result = await request(app.getHttpServer()).get(`/bike?brand=${body.brand}`);
    expect(result.body.totalResults).toBeGreaterThanOrEqual(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items.length).toBeGreaterThanOrEqual(1);
  });

  it('/bike (GET) with search by part of brand should return status 200', async () => {
    const partBrand = body.brand.substring(0, 5);
    const result = await request(app.getHttpServer()).get(`/bike?brand=${partBrand}`);
    expect(result.status).toBe(200);
  });

  it('/bike (GET) with search by part of brand should return at least 1 bike with that brand', async () => {
    const partBrand = body.brand.substring(0, 5);
    const result = await request(app.getHttpServer()).get(`/bike?brand=${body.brand}`);
    result.body.items.forEach((e) => {
      expect(e.brand).toContain(partBrand);
    });
  });

  it('/bike (GET) with search by part of brand should return at least 1 bike with that brand', async () => {
    const result = await request(app.getHttpServer()).get(`/bike?brand=${body.brand}`);
    expect(result.body.totalResults).toBeGreaterThanOrEqual(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items.length).toBeGreaterThanOrEqual(1);
  });

  it('/bike (GET) with invalid limit should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/bike?limit=af');
    expect(result.status).toBe(400);
  });

  it('/bike (GET) with invalid limit should return 1 bike', async () => {
    const result = await request(app.getHttpServer()).get('/bike?limit=af');
    expect(result.body.message).toEqual(['limit must be a number conforming to the specified constraints']);
    expect(result.body.statusCode).toBe(400);
    expect(result.body.error).toBe('Bad Request');
  });
});
