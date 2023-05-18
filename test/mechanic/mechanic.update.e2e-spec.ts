import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import MechanicModule from '../../src/mechanic/mechanic.module';
import {
  updateInvalidMechanic,
  updateValidMechanic,
  validMechanic
} from '../utils/factories/mechanic/mechanic.factory';
import DatabaseModule from '../../src/database/database.module';
import Mechanic from '../../src/mechanic/entities/mechanic.entity';
import StoreModule from '../../src/store/store.module';
import { validStore } from '../utils/factories/store/store.factory';

describe('Mechanic UPDATE (e2e)', () => {
  let app: INestApplication;
  let body: Mechanic;
  let storeId: string;

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
    storeId = resultStore.body?.storeId;
    const result = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/mechanic (PATCH) with valid data should return status 200', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/mechanic/${body.mechanicId}`)
      .send(updateValidMechanic(storeId));
    expect(result.status).toBe(200);
  });

  it('/mechanic (PATCH) with valid data should return success', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/mechanic/${body.mechanicId}`)
      .send(updateValidMechanic(storeId));
    expect(result.body.status).toBe('success');
  });

  it('/mechanic (PATCH) with invalid storeId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/mechanic/${body.mechanicId}`)
      .send(updateValidMechanic('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.status).toBe(404);
  });

  it('/mechanic (PATCH) with invalid storeId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/mechanic/${body.mechanicId}`)
      .send(updateValidMechanic('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Mechanic or Store Not Found');
  });

  it('/mechanic (PATCH) with non existing id should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch('/mechanic/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidMechanic(storeId));
    expect(result.status).toBe(404);
  });

  it('/mechanic (PATCH) ith non existing id should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch('/mechanic/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidMechanic(storeId));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Mechanic or Store Not Found');
  });

  it('/mechanic (PATCH) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch(`/mechanic/${body.mechanicId}`).send(updateInvalidMechanic);
    expect(result.status).toBe(400);
  });

  it('/mechanic (PATCH) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).patch(`/mechanic/${body.mechanicId}`).send(updateInvalidMechanic);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'storeId must be a UUID',
      'storeId must be a string',
      'storeId should not be empty',
      'phone must be a valid phone number',
      'hiringDate must be a valid ISO 8601 date string'
    ]);
  });

  it('/mechanic (PATCH) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer())
      .patch('/mechanic/1519748dsa4a')
      .send(updateValidMechanic(storeId));
    expect(result.status).toBe(400);
  });

  it('/mechanic (PATCH) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer())
      .patch('/mechanic/1519748dsa4a')
      .send(updateValidMechanic(storeId));
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });
});
