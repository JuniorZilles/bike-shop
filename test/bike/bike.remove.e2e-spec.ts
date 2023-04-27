import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import BikeModule from '../../src/bike/bike.module';
import { validBike } from '../utils/factories/bike/bike.factory';
import DatabaseModule from '../../src/database/database.module';
import { validClient } from '../utils/factories/client/client.factory';
import ClientModule from '../../src/client/client.module';

describe('Bike REMOVE (e2e)', () => {
  let app: INestApplication;
  let clientId: string;
  let bikeId: string;

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
    bikeId = resultBike.body.bikeId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/bike (DELETE) with valid bikeId should return status 204', async () => {
    const result = await request(app.getHttpServer()).delete(`/bike/${bikeId}`);
    expect(result.status).toBe(204);
  });

  it('/bike (DELETE) with valid data should return status success', async () => {
    const result = await request(app.getHttpServer()).delete(`/bike/${bikeId}`);
    expect(result.body).toEqual({});
  });

  it('/bike (DELETE) with invalid bikeId should return status 404', async () => {
    const result = await request(app.getHttpServer()).delete('/bike/feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
    expect(result.status).toBe(404);
  });

  it('/bike (DELETE) with invalid bikeId should return an error', async () => {
    const result = await request(app.getHttpServer()).delete('/bike/feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Bike Not Found');
  });

  it('/bike (DELETE) with invalid bikeId should return status 400', async () => {
    const result = await request(app.getHttpServer()).delete('/bike/feb933a0-bb89');
    expect(result.status).toBe(400);
  });

  it('/bike (DELETE) with invalid bikeId should return the validation error', async () => {
    const result = await request(app.getHttpServer()).delete('/bike/feb933a0-bb89');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });
});
