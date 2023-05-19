import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import ServiceModule from '../../src/service/service.module';
import { invalidService, validService } from '../utils/factories/service/service.factory';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';
import ClientModule from '../../src/client/client.module';
import BikeModule from '../../src/bike/bike.module';
import PartModule from '../../src/part/part.module';
import MechanicModule from '../../src/mechanic/mechanic.module';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';

describe('Service INSERT (e2e)', () => {
  let app: INestApplication;
  let storeId: string;
  let mechanicId: string;
  let clientId: string;
  let bikeId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StoreModule, ClientModule, BikeModule, PartModule, MechanicModule, ServiceModule, DatabaseModule]
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
    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    storeId = resultStore.body?.storeId;
    const resultMechanic = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    mechanicId = resultMechanic.body?.mechanicId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/service (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId }));
    expect(result.status).toBe(201);
  });

  it('/service (POST) with valid data should return the data', async () => {
    const validServiceData = validService({ storeId, mechanicId, bikeId, clientId });
    const result = await request(app.getHttpServer()).post('/service').send(validServiceData);
    const service = result.body;
    expect(service.serviceId).toBeDefined();
    expect(service.createdAt).toBeDefined();
    expect(service.updatedAt).toBeDefined();
    expect(service.storeId).toBe(validServiceData.storeId);
    expect(service.additionalItens).toEqual(validServiceData.additionalItens);
    expect(service.bikeId).toBe(validServiceData.bikeId);
    expect(service.clientId).toBe(validServiceData.clientId);
    expect(service.description).toBe(validServiceData.description);
    expect(service.mechanicId).toBe(validServiceData.mechanicId);
    expect(service.isActive).toBe(true);
  });

  it('/service (POST) with invalid storeId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId: '3716ad7c-eac1-47b0-9e59-7a10d989ded4', mechanicId, bikeId, clientId }));
    expect(result.status).toBe(404);
  });

  it('/service (POST) with invalid storeId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId: '3716ad7c-eac1-47b0-9e59-7a10d989ded4', mechanicId, bikeId, clientId }));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Store or Mechanic Not Found');
  });

  it('/service (POST) with invalid mechanicId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId: '3716ad7c-eac1-47b0-9e59-7a10d989ded4', bikeId, clientId }));
    expect(result.status).toBe(404);
  });

  it('/service (POST) with invalid mechanicId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId: '3716ad7c-eac1-47b0-9e59-7a10d989ded4', bikeId, clientId }));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Store or Mechanic Not Found');
  });

  it('/service (POST) with invalid bikeId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId: '3716ad7c-eac1-47b0-9e59-7a10d989ded4', clientId }));
    expect(result.status).toBe(404);
  });

  it('/service (POST) with invalid bikeId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId: '3716ad7c-eac1-47b0-9e59-7a10d989ded4', clientId }));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Client or Bike Not Found');
  });

  it('/service (POST) with invalid clientId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId: '3716ad7c-eac1-47b0-9e59-7a10d989ded4' }));
    expect(result.status).toBe(404);
  });

  it('/service (POST) with invalid clientId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId: '3716ad7c-eac1-47b0-9e59-7a10d989ded4' }));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Client or Bike Not Found');
  });

  it('/service (POST) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).post('/service').send(invalidService);
    expect(result.status).toBe(400);
  });

  it('/service (POST) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).post('/service').send(invalidService);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'storeId must be a UUID',
      'storeId should not be empty',
      'mechanicId must be a UUID',
      'mechanicId should not be empty',
      'clientId must be a UUID',
      'clientId should not be empty',
      'bikeId must be a UUID',
      'bikeId should not be empty',
      'description must be a string',
      'additionalItens.0.description must be a string',
      'additionalItens.0.value must be a number conforming to the specified constraints'
    ]);
  });
});
