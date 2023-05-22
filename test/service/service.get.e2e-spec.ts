import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import ServiceModule from '../../src/service/service.module';
import DatabaseModule from '../../src/database/database.module';
import StoreModule from '../../src/store/store.module';
import ClientModule from '../../src/client/client.module';
import BikeModule from '../../src/bike/bike.module';
import PartModule from '../../src/part/part.module';
import MechanicModule from '../../src/mechanic/mechanic.module';
import { validService } from '../utils/factories/service/service.factory';
import { serviceNotFound } from '../../src/utils/constants/errorMessages';
import { validStore } from '../utils/factories/store/store.factory';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import Service from '../../src/service/entities/service.entity';

describe('Service GET (e2e)', () => {
  let app: INestApplication;
  let body: Service;
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
    const { clientId } = resultClient.body;
    const resultBike = await request(app.getHttpServer()).post('/bike').send(validBike(clientId));
    const { bikeId } = resultBike.body;
    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    const { storeId } = resultStore.body;
    const resultMechanic = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    const mechanicId = resultMechanic.body?.mechanicId;
    const resultService = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId }));
    serviceId = resultService.body.serviceId;
    body = resultService.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/service (GET) with valid ID should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/service/${serviceId}`);
    expect(result.status).toBe(200);
  });

  it('/service (GET) with valid ID should return service data', async () => {
    const result = await request(app.getHttpServer()).get(`/service/${serviceId}`);
    const service = result.body;

    expect(service.serviceId).toBe(body.serviceId);
    expect(service.storeId).toBe(body.storeId);
    expect(service.isActive).toBe(body.isActive);
    expect(service.createdAt).toBeDefined();
    expect(service.updatedAt).toBeDefined();
    expect(service.additionalItens).toEqual(body.additionalItens);
    expect(service.bikeId).toBe(body.bikeId);
    expect(service.clientId).toBe(body.clientId);
    expect(service.description).toBe(body.description);
    expect(service.mechanicId).toBe(body.mechanicId);
  });

  it('/service (GET) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/service/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/service (GET) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).get('/service/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/service (GET) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).get('/service/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/service (GET) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).get('/service/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(serviceNotFound);
  });
});
