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
import { validStore } from '../utils/factories/store/store.factory';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import Service from '../../src/service/entities/service.entity';

describe('Service GET ALL (e2e)', () => {
  let app: INestApplication;
  let body: Service;
  let count: number;

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
    const promises = [];

    const resultClient = await request(app.getHttpServer()).post('/client').send(validClient());
    const { clientId } = resultClient.body;
    const resultBike = await request(app.getHttpServer()).post('/bike').send(validBike(clientId));
    const { bikeId } = resultBike.body;
    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    const { storeId } = resultStore.body;
    const resultMechanic = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    const { mechanicId } = resultMechanic.body;
    const resultService = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId }));
    body = resultService.body;

    for (let i = 0; i < 10; i += 1) {
      promises.push(
        request(app.getHttpServer()).post('/service').send(validService({ storeId, mechanicId, bikeId, clientId }))
      );
    }
    const responses = await Promise.all(promises);
    count = responses.filter((element) => element.status === 201).length + 1;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/service (GET) should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/service');
    expect(result.status).toBe(200);
  });

  it(`/service (GET) should return all ${count} services inserted`, async () => {
    const result = await request(app.getHttpServer()).get('/service');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/service (GET) with limit 1 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/service?limit=1');
    expect(result.status).toBe(200);
  });

  it('/service (GET) with limit 1 should return 1 service', async () => {
    const result = await request(app.getHttpServer()).get('/service?limit=1');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/service (GET) with limit 1 and offset 2 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/service?limit=1&offset=2');
    expect(result.status).toBe(200);
  });

  it('/service (GET) with limit 1 and offset 2 should return 1 service', async () => {
    const result = await request(app.getHttpServer()).get('/service?limit=1&offset=2');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(2);
    expect(result.body.items).toHaveLength(1);
  });

  it('/service (GET) when searching by storeIds one valid and one invalid should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?storeIds=${body.storeId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.status).toBe(200);
  });

  it(`/service (GET) when searching by storeIds one valid and one invalid should return ${count} service`, async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?storeIds=${body.storeId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/service (GET) when searching by storeIds one valid and one invalid should return the service that has the storeId', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?storeIds=${body.storeId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    result.body.items.forEach((element) => {
      expect(element.storeId).toBe(body.storeId);
    });
  });

  it('/service (GET) when searching by mechanicIds one valid and one invalid should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?mechanicIds=${body.mechanicId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.status).toBe(200);
  });

  it(`/service (GET) when searching by mechanicIds one valid and one invalid should return ${count} service`, async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?mechanicIds=${body.mechanicId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/service (GET) when searching by mechanicIds one valid and one invalid should return the service that has the mechanicId', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?mechanicIds=${body.mechanicId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    result.body.items.forEach((element) => {
      expect(element.mechanicId).toBe(body.mechanicId);
    });
  });

  it('/service (GET) when searching by clientIds one valid and one invalid should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?clientIds=${body.clientId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.status).toBe(200);
  });

  it(`/service (GET) when searching by clientIds one valid and one invalid should return ${count} service`, async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?clientIds=${body.clientId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/service (GET) when searching by clientIds one valid and one invalid should return the service that has the clientId', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?clientIds=${body.clientId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );

    result.body.items.forEach((element) => {
      expect(element.clientId).toBe(body.clientId);
    });
  });

  it('/service (GET) when searching by bikeIds one valid and one invalid should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?bikeIds=${body.bikeId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.status).toBe(200);
  });

  it(`/service (GET) when searching by bikeIds one valid and one invalid should return ${count} service`, async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?bikeIds=${body.bikeId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/service (GET) when searching by bikeIds one valid and one invalid should return the service that has the bikeId', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?bikeIds=${body.bikeId},3716ad7c-eac1-47b0-9e59-7a10d989ded4`
    );
    result.body.items.forEach((element) => {
      expect(element.bikeId).toBe(body.bikeId);
    });
  });

  it('/service (GET) when searching by service of creationDate should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?creationDate=${new Date(Date.now() - 560).toISOString()}`
    );
    expect(result.status).toBe(200);
  });

  it('/service (GET) when searching by service of creationDate should return at least one service', async () => {
    const result = await request(app.getHttpServer()).get(
      `/service?creationDate=${new Date(Date.now() - 560).toISOString()}`
    );
    expect(result.body.totalResults).toBeGreaterThanOrEqual(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items.length).toBeGreaterThanOrEqual(1);
  });

  it('/service (GET) when searching by service of creationDate should return all services that where created after the date', async () => {
    const date = new Date(Date.now() - 560);
    const result = await request(app.getHttpServer()).get(`/service?creationDate=${date.toISOString()}`);
    result.body.items.forEach((element) => {
      expect(new Date(element.createdAt).getTime()).toBeGreaterThan(date.getTime());
    });
  });

  it('/service (GET) when searching by service of isActive should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/service?isActive=true`);
    expect(result.status).toBe(200);
  });

  it('/service (GET) when searching by service of isActive should return at least one service', async () => {
    const result = await request(app.getHttpServer()).get(`/service?isActive=true`);
    expect(result.body.totalResults).toBeGreaterThanOrEqual(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items.length).toBeGreaterThanOrEqual(1);
  });

  it('/service (GET) when searching by service of isActive should return all services that where active true', async () => {
    const result = await request(app.getHttpServer()).get(`/service?isActive=true`);
    result.body.items.forEach((element) => {
      expect(element.isActive).toBe(body.isActive);
    });
  });

  it('/service (GET) with clientIds that doesnt exist should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/service?clientIds=john');
    expect(result.status).toBe(200);
  });

  it('/service (GET) with clientIds that doesnt exist should return no service', async () => {
    const result = await request(app.getHttpServer()).get('/service?clientIds=john');
    expect(result.body.totalResults).toBe(0);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(0);
  });

  it('/service (GET) with invalid limit should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/service?limit=af');
    expect(result.status).toBe(400);
  });

  it('/service (GET) with invalid limit should return the validation error', async () => {
    const result = await request(app.getHttpServer()).get('/service?limit=af');
    expect(result.body.message).toEqual(['limit must be a number conforming to the specified constraints']);
    expect(result.body.statusCode).toBe(400);
    expect(result.body.error).toBe('Bad Request');
  });
});
