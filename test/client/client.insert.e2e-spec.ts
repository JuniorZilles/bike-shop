import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import ClientModule from '../../src/client/client.module';
import { invalidClient, validClient } from '../utils/factories/client/client.factory';
import DatabaseModule from '../../src/database/database.module';

describe('Client INSERT (e2e)', () => {
  let app: INestApplication;

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
  });

  afterEach(async () => {
    await app.close();
  });

  it('/client (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer()).post('/client').send(validClient);
    expect(result.status).toBe(201);
  });

  it('/client (POST) with valid data should return the data without the password', async () => {
    const result = await request(app.getHttpServer()).post('/client').send(validClient);
    expect(result.body.email).toBe(validClient.email);
    expect(result.body.password).toBeUndefined();
    expect(result.body.name).toBe(validClient.name);
    expect(result.body.birthday).toBe(validClient.birthday);
    expect(result.body.phone).toBe(validClient.phone);
  });

  it('/client (POST) with duplicated email should return status 409', async () => {
    await request(app.getHttpServer()).post('/client').send(validClient);
    const result = await request(app.getHttpServer()).post('/client').send(validClient);
    expect(result.status).toBe(409);
  });

  it('/client (POST) with duplicated email should return an error', async () => {
    await request(app.getHttpServer()).post('/client').send(validClient);
    const result = await request(app.getHttpServer()).post('/client').send(validClient);
    expect(result.body.error).toBe('Conflict');
    expect(result.body.statusCode).toBe(409);
    expect(result.body.message).toBe('Email already in use');
  });

  it('/client (POST) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).post('/client').send(invalidClient);
    expect(result.status).toBe(400);
  });

  it('/client (POST) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).post('/client').send(invalidClient);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual(['password is not strong enough']);
  });
});
