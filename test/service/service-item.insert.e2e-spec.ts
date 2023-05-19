import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import ServiceModule from '../../src/service/service.module';
import { invalidServiceItem, validServiceItem } from '../utils/factories/service/service-item.factory';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';
import { partNotFound, serviceNotFound } from '../../src/utils/constants/errorMessages';
import ClientModule from '../../src/client/client.module';
import BikeModule from '../../src/bike/bike.module';
import PartModule from '../../src/part/part.module';
import MechanicModule from '../../src/mechanic/mechanic.module';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validPart } from '../utils/factories/part/part.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import { validService } from '../utils/factories/service/service.factory';

describe('Service Item INSERT (e2e)', () => {
  let app: INestApplication;
  let storeId: string;
  let mechanicId: string;
  let clientId: string;
  let bikeId: string;
  let partId: string;
  let serviceId: string;

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
    const resultPart = await request(app.getHttpServer()).post('/part').send(validPart(storeId));
    partId = resultPart.body?.partId;
    const resultMechanic = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    mechanicId = resultMechanic.body?.mechanicId;
    const resultService = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId }));
    serviceId = resultService.body?.serviceId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/item (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer()).post(`/service/${serviceId}/item`).send(validServiceItem(partId));
    expect(result.status).toBe(201);
  });

  it('/item (POST) with valid data should return the data', async () => {
    const validServiceItemData = validServiceItem(partId);
    const result = await request(app.getHttpServer()).post(`/service/${serviceId}/item`).send(validServiceItemData);
    const item = result.body;
    expect(item.serviceItemId).toBeDefined();
    expect(item.createdAt).toBeDefined();
    expect(item.updatedAt).toBeDefined();
    expect(item.partId).toBe(validServiceItemData.partId);
    expect(item.qtd).toBe(validServiceItemData.qtd);
    expect(item.unitPrice).toBe(validServiceItemData.unitPrice);
  });

  it('/item (POST) with invalid partId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .post(`/service/${serviceId}/item`)
      .send(validServiceItem('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.status).toBe(404);
  });

  it('/item (POST) with invalid partId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post(`/service/${serviceId}/item`)
      .send(validServiceItem('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(partNotFound);
  });

  it('/item (POST) with invalid serviceId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .post(`/service/3716ad7c-eac1-47b0-9e59-7a10d989ded4/item`)
      .send(validServiceItem(partId));
    expect(result.status).toBe(404);
  });

  it('/item (POST) with invalid serviceId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post(`/service/3716ad7c-eac1-47b0-9e59-7a10d989ded4/item`)
      .send(validServiceItem(partId));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(serviceNotFound);
  });

  it('/item (POST) with invalid serviceId format should return status 400', async () => {
    const result = await request(app.getHttpServer())
      .post(`/service/3716ad7c-eac1-47b0-9/item`)
      .send(validServiceItem(partId));
    expect(result.status).toBe(400);
  });

  it('/item (POST) with invalid serviceId format should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post(`/service/3716ad7c-eac1-47b0-9/item`)
      .send(validServiceItem(partId));
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toBe('Validation failed (uuid is expected)');
  });

  it('/item (POST) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).post(`/service/${serviceId}/item`).send(invalidServiceItem);
    expect(result.status).toBe(400);
  });

  it('/item (POST) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).post(`/service/${serviceId}/item`).send(invalidServiceItem);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'partId must be a UUID',
      'partId should not be empty',
      'qtd must be a number conforming to the specified constraints',
      'unitPrice must be a number conforming to the specified constraints'
    ]);
  });
});
