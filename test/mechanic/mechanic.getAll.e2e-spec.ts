import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import MechanicModule from '../../src/mechanic/mechanic.module';
import DatabaseModule from '../../src/database/database.module';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import Mechanic from '../../src/mechanic/entities/mechanic.entity';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';

describe('Mechanic GET ALL (e2e)', () => {
  let app: INestApplication;
  let body: Mechanic;
  let count: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StoreModule, MechanicModule, DatabaseModule]
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

    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());

    for (let i = 0; i < 10; i += 1) {
      promises.push(request(app.getHttpServer()).post('/mechanic').send(validMechanic(resultStore.body?.storeId)));
    }
    const responses = await Promise.all(promises);
    count = responses.filter((element) => element.status === 201).length + 1;
    const result = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(resultStore.body?.storeId));
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/mechanic (GET) should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic');
    expect(result.status).toBe(200);
  });

  it(`/mechanic (GET) should return all ${count} mechanics inserted`, async () => {
    const result = await request(app.getHttpServer()).get('/mechanic');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/mechanic (GET) with limit 1 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic?limit=1');
    expect(result.status).toBe(200);
  });

  it('/mechanic (GET) with limit 1 should return 1 mechanic', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic?limit=1');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/mechanic (GET) with limit 1 and offset 2 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic?limit=1&offset=2');
    expect(result.status).toBe(200);
  });

  it('/mechanic (GET) with limit 1 and offset 2 should return 1 mechanic', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic?limit=1&offset=2');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(2);
    expect(result.body.items).toHaveLength(1);
  });

  it('/mechanic (GET) with search by email should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/mechanic?email=${body.email}`);
    expect(result.status).toBe(200);
  });

  it('/mechanic (GET) with search by email should return 1 mechanic', async () => {
    const result = await request(app.getHttpServer()).get(`/mechanic?email=${body.email}`);
    expect(result.body.totalResults).toBe(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/mechanic (GET) with search by email should return the mechanic that has the email', async () => {
    const result = await request(app.getHttpServer()).get(`/mechanic?email=${body.email}`);
    expect(result.body.items[0].email).toBe(body.email);
  });

  it('/mechanic (GET) with search by part of name should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/mechanic?name=${body.name.split(' ')[0]}`);
    expect(result.status).toBe(200);
  });

  it('/mechanic (GET) with search by part of name should return at least one mechanic', async () => {
    const result = await request(app.getHttpServer()).get(`/mechanic?name=${body.name.split(' ')[0]}`);
    expect(result.body.totalResults).toBeGreaterThanOrEqual(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items.length).toBeGreaterThanOrEqual(1);
  });

  it('/mechanic (GET) with search by part of name should return the mechanics that have the same part name', async () => {
    const partName = body.name.split(' ')[0];
    const result = await request(app.getHttpServer()).get(`/mechanic?name=${partName}`);
    result.body.items.forEach((element: Mechanic) => {
      expect(element.name).toContain(partName);
    });
  });

  it('/mechanic (GET) with email that doesnt exist should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic?email=john.doe@mail.com');
    expect(result.status).toBe(200);
  });

  it('/mechanic (GET) with email that doesnt exist should return no mechanic', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic?email=john.doe@mail.com');
    expect(result.body.totalResults).toBe(0);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(0);
  });

  it('/mechanic (GET) with invalid limit should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic?limit=af');
    expect(result.status).toBe(400);
  });

  it('/mechanic (GET) with invalid limit should return the validation error', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic?limit=af');
    expect(result.body.message).toEqual(['limit must be a number conforming to the specified constraints']);
    expect(result.body.statusCode).toBe(400);
    expect(result.body.error).toBe('Bad Request');
  });
});
