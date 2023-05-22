import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import ServiceModule from '../../src/service/service.module';
import { validServiceItem } from '../utils/factories/service/service-item.factory';
import { validStore } from '../utils/factories/store/store.factory';
import DatabaseModule from '../../src/database/database.module';
import StoreModule from '../../src/store/store.module';
import ClientModule from '../../src/client/client.module';
import BikeModule from '../../src/bike/bike.module';
import PartModule from '../../src/part/part.module';
import MechanicModule from '../../src/mechanic/mechanic.module';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import { validPart } from '../utils/factories/part/part.factory';
import { validService } from '../utils/factories/service/service.factory';

describe('ServiceItem REMOVE (e2e)', () => {
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

  it('/serviceItem (DELETE) with valid ID should return status 204', async () => {
    const result = await request(app.getHttpServer()).delete(`/service/${serviceId}/item/${serviceItemId}`);
    expect(result.status).toBe(204);
  });

  it('/serviceItem (DELETE) with valid ID should return empty body', async () => {
    const result = await request(app.getHttpServer()).delete(`/service/${serviceId}/item/${serviceItemId}`);
    expect(result.body).toEqual({});
  });

  it('/serviceItem (DELETE) with invalid serviceItemId should return status 400', async () => {
    const result = await request(app.getHttpServer()).delete(`/service/${serviceId}/item/1519748dsa4a`);
    expect(result.status).toBe(400);
  });

  it('/serviceItem (DELETE) with invalid serviceItemId should return validation error', async () => {
    const result = await request(app.getHttpServer()).delete(`/service/${serviceId}/item/1519748dsa4a`);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/serviceItem (DELETE) with invalid serviceId should return status 400', async () => {
    const result = await request(app.getHttpServer()).delete(`/service/1519748dsa4a/item/${serviceItemId}`);
    expect(result.status).toBe(400);
  });

  it('/serviceItem (DELETE) with invalid serviceId should return validation error', async () => {
    const result = await request(app.getHttpServer()).delete(`/service/1519748dsa4a/item/${serviceItemId}`);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/serviceItem (DELETE) with non existing serviceItemId should return status 404', async () => {
    const result = await request(app.getHttpServer()).delete(
      `/service/${serviceId}/item/3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.status).toBe(404);
  });

  it('/serviceItem (DELETE) with non existing serviceItemId should return not found error', async () => {
    const result = await request(app.getHttpServer()).delete(
      `/service/${serviceId}/item/3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Service or Service Item Not Found');
  });

  it('/serviceItem (DELETE) with non existing serviceId should return status 404', async () => {
    const result = await request(app.getHttpServer()).delete(
      `/service/3716ad7c-eac1-47b0-9e59-7a10d989ded4/item/${serviceItemId}`
    );
    expect(result.status).toBe(404);
  });

  it('/serviceItem (DELETE) with non existing serviceId should return not found error', async () => {
    const result = await request(app.getHttpServer()).delete(
      `/service/3716ad7c-eac1-47b0-9e59-7a10d989ded4/item/${serviceItemId}`
    );
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Service or Service Item Not Found');
  });
});
