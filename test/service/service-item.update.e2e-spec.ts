import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import {
  updateInvalidServiceItem,
  updateValidServiceItem,
  validServiceItem
} from '../utils/factories/service/service-item.factory';
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
import ServiceModule from '../../src/service/service.module';
import { validService } from '../utils/factories/service/service.factory';
import { validPart } from '../utils/factories/part/part.factory';

describe('ServiceItem UPDATE (e2e)', () => {
  let app: INestApplication;
  let serviceId: string;
  let serviceItemId: string;

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
    const { storeId } = resultStore.body;
    const resultMechanic = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    const mechanicId = resultMechanic.body?.mechanicId;
    const resultPart = await request(app.getHttpServer()).post('/part').send(validPart(storeId));
    const { partId } = resultPart.body;
    const resultService = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId }));
    serviceId = resultService.body.serviceId;
    const resultServiceItem = await request(app.getHttpServer())
      .post(`/service/${serviceId}/item`)
      .send(validServiceItem(partId));
    serviceItemId = resultServiceItem.body?.serviceItemId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/service (PATCH) with valid data should return status 200', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}/item/${serviceItemId}`)
      .send(updateValidServiceItem());
    expect(result.status).toBe(200);
  });

  it('/service (PATCH) with valid data should return success', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}/item/${serviceItemId}`)
      .send(updateValidServiceItem());
    expect(result.body.status).toBe('success');
  });

  it('/service (PATCH) with non existing serviceId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/feb933a0-bb89-4d2d-a83d-a7ff83cd6334/item/${serviceItemId}`)
      .send(updateValidServiceItem());
    expect(result.status).toBe(404);
  });

  it('/service (PATCH) ith non existing serviceId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/feb933a0-bb89-4d2d-a83d-a7ff83cd6334/item/${serviceItemId}`)
      .send(updateValidServiceItem());
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Service or Service Item Not Found');
  });

  it('/service (PATCH) with non existing serviceItemId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}/item/feb933a0-bb89-4d2d-a83d-a7ff83cd6334`)
      .send(updateValidServiceItem());
    expect(result.status).toBe(404);
  });

  it('/service (PATCH) ith non existing serviceItemId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}/item/feb933a0-bb89-4d2d-a83d-a7ff83cd6334`)
      .send(updateValidServiceItem());
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Service or Service Item Not Found');
  });

  it('/service (PATCH) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}/item/${serviceItemId}`)
      .send(updateInvalidServiceItem);
    expect(result.status).toBe(400);
  });

  it('/service (PATCH) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}/item/${serviceItemId}`)
      .send(updateInvalidServiceItem);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'qtd must be a number conforming to the specified constraints',
      'unitPrice must be a number conforming to the specified constraints'
    ]);
  });

  it('/service (PATCH) with invalid serviceId should return status 400', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/1519748dsa4a/item/${serviceItemId}`)
      .send(updateValidServiceItem());
    expect(result.status).toBe(400);
  });

  it('/service (PATCH) with invalid serviceId should return validation error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/1519748dsa4a/item/${serviceItemId}`)
      .send(updateValidServiceItem());
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/service (PATCH) with invalid serviceItemId should return status 400', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}/item/1519748dsa4a`)
      .send(updateValidServiceItem());
    expect(result.status).toBe(400);
  });

  it('/service (PATCH) with invalid serviceItemId should return validation error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/service/${serviceId}/item/1519748dsa4a`)
      .send(updateValidServiceItem());
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });
});
