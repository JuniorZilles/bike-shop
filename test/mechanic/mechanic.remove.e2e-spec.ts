import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import MechanicModule from '../../src/mechanic/mechanic.module';
import DatabaseModule from '../../src/database/database.module';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import Mechanic from '../../src/mechanic/entities/mechanic.entity';
import { mechanicNotFound } from '../../src/utils/constants/errorMessages';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';

describe('Mechanic REMOVE (e2e)', () => {
  let app: INestApplication;
  let body: Mechanic;

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

    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    const result = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(resultStore.body?.storeId));
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/mechanic (DELETE) with valid ID should return status 204', async () => {
    const result = await request(app.getHttpServer()).delete(`/mechanic/${body.mechanicId}`);
    expect(result.status).toBe(204);
  });

  it('/mechanic (DELETE) with valid ID should return empty body', async () => {
    const result = await request(app.getHttpServer()).delete(`/mechanic/${body.mechanicId}`);
    expect(result.body).toEqual({});
  });

  it('/mechanic (DELETE) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).delete('/mechanic/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/mechanic (DELETE) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).delete('/mechanic/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/mechanic (DELETE) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).delete('/mechanic/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/mechanic (DELETE) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).delete('/mechanic/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(mechanicNotFound);
  });
});
