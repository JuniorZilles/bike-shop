import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import ClientModule from '../../src/client/client.module';
import { updateInvalidClient, updateValidClient, validClient } from '../utils/factories/client/client.factory';
import DatabaseModule from '../../src/database/database.module';
import Client from '../../src/client/entities/client.entity';

describe('Client UPDATE (e2e)', () => {
  let app: INestApplication;
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

    const result = await request(app.getHttpServer()).post('/client').send(validClient);
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/client (PATCH) with valid data should return status 200', async () => {
    const result = await request(app.getHttpServer()).patch(`/client/${body.clientId}`).send(updateValidClient);
    expect(result.status).toBe(200);
  });

  it('/client (PATCH) with valid data should return success', async () => {
    const result = await request(app.getHttpServer()).patch(`/client/${body.clientId}`).send(updateValidClient);
    expect(result.body.status).toBe('success');
  });

  it('/client (PATCH) with non existing id should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch('/client/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidClient);
    expect(result.status).toBe(404);
  });

  it('/client (PATCH) ith non existing id should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch('/client/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidClient);
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Client Not Found');
  });

  it('/client (PATCH) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch(`/client/${body.clientId}`).send(updateInvalidClient);
    expect(result.status).toBe(400);
  });

  it('/client (PATCH) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).patch(`/client/${body.clientId}`).send(updateInvalidClient);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual(['birthday must be a valid ISO 8601 date string']);
  });
});
