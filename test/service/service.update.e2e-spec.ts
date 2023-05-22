import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import ServiceModule from '../../src/service/service.module';
import { updateInvalidService, updateValidService, validService } from '../utils/factories/service/service.factory';
import DatabaseModule from '../../src/database/database.module';
import StoreModule from '../../src/store/store.module';
import ClientModule from '../../src/client/client.module';
import BikeModule from '../../src/bike/bike.module';
import PartModule from '../../src/part/part.module';
import MechanicModule from '../../src/mechanic/mechanic.module';
import { validStore } from '../utils/factories/store/store.factory';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import { serviceNotFound } from '../../src/utils/constants/errorMessages';

describe('Service UPDATE (e2e)', () => {
  let app: INestApplication;
  let serviceId: string;
  let storeId: string;

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
    const { clientId } = resultClient.body;
    const resultBike = await request(app.getHttpServer()).post('/bike').send(validBike(clientId));
    const { bikeId } = resultBike.body;
    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    storeId = resultStore.body?.storeId;
    const resultMechanic = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    const mechanicId = resultMechanic.body?.mechanicId;
    const resultService = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId }));
    serviceId = resultService.body.serviceId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/service (PATCH) with valid data should return status 200', async () => {
    const result = await request(app.getHttpServer()).patch(`/service/${serviceId}`).send(updateValidService());
    expect(result.status).toBe(200);
  });

  it('/service (PATCH) with valid data should return success', async () => {
    const result = await request(app.getHttpServer()).patch(`/service/${serviceId}`).send(updateValidService());
    expect(result.body.status).toBe('success');
  });

  it('/service (PATCH) with invalid mechanicId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}`)
      .send(updateValidService('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.status).toBe(404);
  });

  it('/service (PATCH) with invalid mechanicId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}`)
      .send(updateValidService('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Mechanic Not Found');
  });

  it('/service (PATCH) with invalid mechanicId should return status 400', async () => {
    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    const resultMechanic = await request(app.getHttpServer())
      .post('/mechanic')
      .send(validMechanic(resultStore.body?.storeId));
    const mechanicIdOther = resultMechanic.body?.mechanicId;
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}`)
      .send(updateValidService(mechanicIdOther));
    expect(result.status).toBe(400);
  });

  it('/service (PATCH) with invalid mechanicId should return an error', async () => {
    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    const resultMechanic = await request(app.getHttpServer())
      .post('/mechanic')
      .send(validMechanic(resultStore.body?.storeId));
    const mechanicIdOther = resultMechanic.body?.mechanicId;
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}`)
      .send(updateValidService(mechanicIdOther));
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toBe('Invalid mechanic for selected service');
  });

  it('/service (PATCH) with non existing id should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch('/service/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidService());
    expect(result.status).toBe(404);
  });

  it('/service (PATCH) ith non existing id should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch('/service/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidService());
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(serviceNotFound);
  });

  it('/service (PATCH) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch(`/service/${serviceId}`).send(updateInvalidService);
    expect(result.status).toBe(400);
  });

  it('/service (PATCH) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).patch(`/service/${serviceId}`).send(updateInvalidService);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'property isActive should not exist',
      'description must be a string',
      'additionalItens.0.description must be a string',
      'additionalItens.0.value must be a number conforming to the specified constraints'
    ]);
  });

  it('/service (PATCH) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch('/service/1519748dsa4a').send(updateValidService());
    expect(result.status).toBe(400);
  });

  it('/service (PATCH) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).patch('/service/1519748dsa4a').send(updateValidService());
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });
});
