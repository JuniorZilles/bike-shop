import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import ClientModule from '../../src/client/client.module';
import DatabaseModule from '../../src/database/database.module';
import { validClient } from '../utils/factories/client/client.factory';
import Client from '../../src/client/entities/client.entity';

describe('Client GET (e2e)', () => {
  let app: INestApplication;
  const clientData = validClient();
  let body: Client;

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

    const result = await request(app.getHttpServer()).post('/client').send(clientData);
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/client (GET) with valid ID should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/client/${body.clientId}`);
    expect(result.status).toBe(200);
  });

  it('/client (GET) with valid ID should return client data', async () => {
    const result = await request(app.getHttpServer()).get(`/client/${body.clientId}`);
    expect(result.body.clientId).toBe(body.clientId);
    expect(result.body.email).toBe(clientData.email);
    expect(result.body.password).toBeUndefined();
    expect(result.body.name).toBe(clientData.name);
    expect(new Date(result.body.birthday)).toEqual(clientData.birthday);
    expect(result.body.phone).toBe(clientData.phone);
  });

  it('/client (GET) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/client/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/client (GET) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).get('/client/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/client (GET) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).get('/client/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/client (GET) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).get('/client/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Client Not Found');
  });
});
