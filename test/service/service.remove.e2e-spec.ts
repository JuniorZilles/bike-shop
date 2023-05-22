import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import ServiceModule from '../../src/service/service.module';
import { validService } from '../utils/factories/service/service.factory';
import { serviceNotFound } from '../../src/utils/constants/errorMessages';
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

describe('Service REMOVE (e2e)', () => {
  let app: INestApplication;
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
  });

  afterEach(async () => {
    await app.close();
  });

  it('/service (DELETE) with valid ID should return status 204', async () => {
    const result = await request(app.getHttpServer()).delete(`/service/${serviceId}`);
    expect(result.status).toBe(204);
  });

  it('/service (DELETE) with valid ID should return empty body', async () => {
    const result = await request(app.getHttpServer()).delete(`/service/${serviceId}`);
    expect(result.body).toEqual({});
  });

  it('/service (DELETE) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).delete('/service/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/service (DELETE) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).delete('/service/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/service (DELETE) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).delete('/service/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/service (DELETE) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).delete('/service/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(serviceNotFound);
  });
});
