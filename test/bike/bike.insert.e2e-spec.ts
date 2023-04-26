import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import BikeModule from '../../src/bike/bike.module';
import { invalidBike, validBike } from '../utils/factories/bike/bike.factory';
import DatabaseModule from '../../src/database/database.module';
import { validClient } from '../utils/factories/client/client.factory';
import ClientModule from '../../src/client/client.module';

describe('Bike INSERT (e2e)', () => {
  let app: INestApplication;
  let clientId: string;

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

    const result = await request(app.getHttpServer()).post('/client').send(validClient());
    clientId = result.body.clientId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/bike (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer()).post('/bike').send(validBike(clientId));
    expect(result.status).toBe(201);
  });

  it('/bike (POST) with valid data should return the data', async () => {
    const validBikeData = validBike(clientId);
    const result = await request(app.getHttpServer()).post('/bike').send(validBikeData);
    expect(result.body.brand).toBe(validBikeData.brand);
    expect(result.body.clientId).toBe(validBikeData.clientId);
    expect(result.body.color).toBe(validBikeData.color);
    expect(result.body.displayName).toEqual(validBikeData.displayName);
    expect(result.body.nr).toBe(validBikeData.nr);
    expect(result.body.rimSize).toBe(validBikeData.rimSize);
  });

  it('/bike (POST) with invalid clientId should return status 404', async () => {
    const validBikeData = validBike('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
    const result = await request(app.getHttpServer()).post('/bike').send(validBikeData);
    expect(result.status).toBe(404);
  });

  it('/bike (POST) with invalid clientId should return an error', async () => {
    const validBikeData = validBike('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
    const result = await request(app.getHttpServer()).post('/bike').send(validBikeData);
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('User not found');
  });

  it('/bike (POST) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).post('/bike').send(invalidBike);
    expect(result.status).toBe(400);
  });

  it('/bike (POST) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).post('/bike').send(invalidBike);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'rimSize must be a number conforming to the specified constraints',
      'clientId must be a UUID',
      'clientId must be a string',
      'clientId should not be empty'
    ]);
  });
});
