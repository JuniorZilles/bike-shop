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
import { validPart } from '../utils/factories/part/part.factory';
import { validServiceItem } from '../utils/factories/service/service-item.factory';
import ServiceItem from '../../src/service/entities/serviceItem.entity';

describe('Service GET (e2e)', () => {
  let app: INestApplication;
  let body: Service;
  let bodyItem: ServiceItem;
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
    const resultPart = await request(app.getHttpServer()).post('/part').send(validPart(storeId));
    const { partId } = resultPart.body;
    const resultMechanic = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    const { mechanicId } = resultMechanic.body;
    const resultService = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId }));
    serviceId = resultService.body.serviceId;
    const resultServiceItem = await request(app.getHttpServer())
      .post(`/service/${serviceId}/item`)
      .send(validServiceItem(partId));
    serviceId = resultService.body.serviceId;
    body = resultService.body;
    bodyItem = resultServiceItem.body;
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
    expect(service.itens.length).toEqual(1);
    expect(service.itens[0].partId).toBe(bodyItem.partId);
    expect(service.itens[0].qtd).toBe(bodyItem.qtd);
    expect(service.itens[0].unitPrice).toBe(bodyItem.unitPrice);
    expect(service.itens[0].createdAt).toBe(bodyItem.createdAt);
    expect(service.itens[0].updatedAt).toBe(bodyItem.updatedAt);
    expect(service.itens[0].serviceItemId).toBe(bodyItem.serviceItemId);
    expect(service.bikeId).toBe(body.bikeId);
    expect(service.clientId).toBe(body.clientId);
    expect(service.description).toBe(body.description);
    expect(service.mechanicId).toBe(body.mechanicId);
  });

  it('/service (GET) get all should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/service');
    expect(result.status).toBe(200);
  });

  it('/service (GET) get all should return service data', async () => {
    const result = await request(app.getHttpServer()).get('/service');
    const service = result.body;
    expect(service.totalResults).toBe(1);
    expect(service.limit).toBe(20);
    expect(service.offset).toBe(0);
    expect(service.items).toHaveLength(1);
    expect(service.items[0].serviceId).toBe(body.serviceId);
    expect(service.items[0].storeId).toBe(body.storeId);
    expect(service.items[0].isActive).toBe(body.isActive);
    expect(service.items[0].createdAt).toBeDefined();
    expect(service.items[0].updatedAt).toBeDefined();
    expect(service.items[0].additionalItens).toEqual(body.additionalItens);
    expect(service.items[0].itens.length).toEqual(1);
    expect(service.items[0].itens[0].partId).toBe(bodyItem.partId);
    expect(service.items[0].itens[0].qtd).toBe(bodyItem.qtd);
    expect(service.items[0].itens[0].unitPrice).toBe(bodyItem.unitPrice);
    expect(service.items[0].itens[0].createdAt).toBe(bodyItem.createdAt);
    expect(service.items[0].itens[0].updatedAt).toBe(bodyItem.updatedAt);
    expect(service.items[0].itens[0].serviceItemId).toBe(bodyItem.serviceItemId);
    expect(service.items[0].bikeId).toBe(body.bikeId);
    expect(service.items[0].clientId).toBe(body.clientId);
    expect(service.items[0].description).toBe(body.description);
    expect(service.items[0].mechanicId).toBe(body.mechanicId);
  });
});
