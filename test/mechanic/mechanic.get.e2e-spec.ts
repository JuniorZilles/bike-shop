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

describe('Mechanic GET (e2e)', () => {
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

  it('/mechanic (GET) with valid ID should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/mechanic/${body.mechanicId}`);
    expect(result.status).toBe(200);
  });

  it('/mechanic (GET) with valid ID should return mechanic data', async () => {
    const result = await request(app.getHttpServer()).get(`/mechanic/${body.mechanicId}`);
    const mechanic = result.body;

    expect(mechanic.mechanicId).toBe(body.mechanicId);
    expect(mechanic.password).toBeUndefined();
    expect(mechanic.storeId).toBe(body.storeId);
    expect(mechanic.email).toBe(body.email);
    expect(mechanic.name).toBe(body.name);
    expect(mechanic.phone).toBe(body.phone);
    expect(mechanic.hiringDate).toBe(body.hiringDate);
    expect(mechanic.isActive).toBe(body.isActive);
  });

  it('/mechanic (GET) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/mechanic (GET) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/mechanic (GET) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/mechanic (GET) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).get('/mechanic/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(mechanicNotFound);
  });
});
