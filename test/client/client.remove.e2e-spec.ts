import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import ClientModule from '../../src/client/client.module';
import DatabaseModule from '../../src/database/database.module';
import { validClient } from '../utils/factories/client/client.factory';
import Client from '../../src/client/entities/client.entity';

describe('Client REMOVE (e2e)', () => {
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

  it('/client (DELETE) with valid ID should return status 204', async () => {
    const result = await request(app.getHttpServer()).delete(`/client/${body.clientId}`);
    expect(result.status).toBe(204);
  });

  it('/client (DELETE) with valid ID should return empty body', async () => {
    const result = await request(app.getHttpServer()).delete(`/client/${body.clientId}`);
    expect(result.body).toEqual({});
  });

  it('/client (DELETE) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).delete('/client/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/client (DELETE) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).delete('/client/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/client (DELETE) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).delete('/client/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/client (DELETE) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).delete('/client/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Client Not Found');
  });
});
