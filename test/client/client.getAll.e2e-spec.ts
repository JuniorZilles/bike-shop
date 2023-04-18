import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import ClientModule from '../../src/client/client.module';
import DatabaseModule from '../../src/database/database.module';
import { validClient } from '../utils/factories/client/client.factory';
import Client from '../../src/client/entities/client.entity';

describe('Client GET ALL (e2e)', () => {
  let app: INestApplication;
  const clientData = validClient();
  let body: Client;
  let count: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ClientModule, DatabaseModule]
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
      const data = validClient();
      promises.push(request(app.getHttpServer()).post('/client').send(data));
    }
    const responses = await Promise.all(promises);
    count = responses.map((element) => element.status === 200).length + 1;
    const result = await request(app.getHttpServer()).post('/client').send(clientData);
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/client (GET) should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/client');
    expect(result.status).toBe(200);
  });

  it(`/client (GET) should return all ${count} clients inserted`, async () => {
    const result = await request(app.getHttpServer()).get('/client');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/client (GET) with limit 1 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/client?limit=1');
    expect(result.status).toBe(200);
  });

  it('/client (GET) with limit 1 should return 1 client', async () => {
    const result = await request(app.getHttpServer()).get('/client?limit=1');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/client (GET) with limit 1 and offset 2 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/client?limit=1&offset=2');
    expect(result.status).toBe(200);
  });

  it('/client (GET) with limit 1 and offset 2 should return 1 client', async () => {
    const result = await request(app.getHttpServer()).get('/client?limit=1&offset=2');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(2);
    expect(result.body.items).toHaveLength(1);
  });

  it('/client (GET) with search by email should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/client?email=${body.email}`);
    expect(result.status).toBe(200);
  });

  it('/client (GET) with search by email should return 1 client', async () => {
    const result = await request(app.getHttpServer()).get(`/client?email=${body.email}`);
    expect(result.body.totalResults).toBe(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/client (GET) with search by email should return the client that has the email', async () => {
    const result = await request(app.getHttpServer()).get(`/client?email=${body.email}`);
    expect(result.body.items[0].email).toBe(body.email);
  });

  it('/client (GET) with search by part of name should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/client?name=${body.name.split(' ')[0]}`);
    expect(result.status).toBe(200);
  });

  it('/client (GET) with search by part of name should return at least one client', async () => {
    const result = await request(app.getHttpServer()).get(`/client?name=${body.name.split(' ')[0]}`);
    expect(result.body.totalResults).toBeGreaterThanOrEqual(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items.length).toBeGreaterThanOrEqual(1);
  });

  it('/client (GET) with search by part of name should return the clients that have the same part name', async () => {
    const partName = body.name.split(' ')[0];
    const result = await request(app.getHttpServer()).get(`/client?name=${partName}`);
    result.body.items.forEach((element: Client) => {
      expect(element.name).toContain(partName);
    });
  });

  it('/client (GET) with email that doesnt exist should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/client?email=john.doe@mail.com');
    expect(result.status).toBe(200);
  });

  it('/client (GET) with email that doesnt exist should return no client', async () => {
    const result = await request(app.getHttpServer()).get('/client?email=john.doe@mail.com');
    expect(result.body.totalResults).toBe(0);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(0);
  });

  it('/client (GET) with invalid limit should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/client?limit=af');
    expect(result.status).toBe(400);
  });

  it('/client (GET) with invalid limit should return the validation error', async () => {
    const result = await request(app.getHttpServer()).get('/client?limit=af');
    expect(result.body.message).toEqual(['limit must be a number conforming to the specified constraints']);
    expect(result.body.statusCode).toBe(400);
    expect(result.body.error).toBe('Bad Request');
  });
});
