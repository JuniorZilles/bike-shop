import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import DatabaseModule from '../../src/database/database.module';
import Feedback from '../../src/feedback/entities/feedback.entity';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';
import FeedbackModule from '../../src/feedback/feedback.module';
import ClientModule from '../../src/client/client.module';
import BikeModule from '../../src/bike/bike.module';
import MechanicModule from '../../src/mechanic/mechanic.module';
import ServiceModule from '../../src/service/service.module';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import { validService } from '../utils/factories/service/service.factory';
import { validFeedback } from '../utils/factories/feedback/feedback.factory';

describe('Feedback GET ALL (e2e)', () => {
  let app: INestApplication;
  let body: Feedback;
  let count: number;
  let clientId: string;
  let mechanicId: string;
  let storeId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        StoreModule,
        ClientModule,
        BikeModule,
        PartModule,
        MechanicModule,
        ServiceModule,
        FeedbackModule,
        DatabaseModule
      ]
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
    const { bikeId } = resultBike.body;
    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    storeId = resultStore.body.storeId;
    const resultMechanic = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    mechanicId = resultMechanic.body.mechanicId;
    const resultService = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId }));
    const { serviceId } = resultService.body;
    const resultFeedBack = await request(app.getHttpServer()).post('/feedback').send(validFeedback(serviceId));
    body = resultFeedBack.body;

    const promisesService = [];
    for (let i = 0; i < 10; i += 1) {
      promisesService.push(
        request(app.getHttpServer()).post('/service').send(validService({ storeId, mechanicId, bikeId, clientId }))
      );
    }
    const responsesService = await Promise.all(promisesService);

    const promises = [];
    responsesService.forEach((service) => {
      if (service.status === 201) {
        promises.push(request(app.getHttpServer()).post('/feedback').send(validFeedback(service.body.serviceId)));
      }
    });

    const responses = await Promise.all(promises);
    count = responses.filter((element) => element.status === 201).length + 1;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/feedback (GET) should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/feedback');
    expect(result.status).toBe(200);
  });

  it(`/feedback (GET) should return all ${count} feedbacks inserted`, async () => {
    const result = await request(app.getHttpServer()).get('/feedback');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/feedback (GET) with limit 1 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/feedback?limit=1');
    expect(result.status).toBe(200);
  });

  it('/feedback (GET) with limit 1 should return 1 feedback', async () => {
    const result = await request(app.getHttpServer()).get('/feedback?limit=1');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/feedback (GET) with limit 1 and offset 2 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/feedback?limit=1&offset=2');
    expect(result.status).toBe(200);
  });

  it('/feedback (GET) with limit 1 and offset 2 should return 1 feedback', async () => {
    const result = await request(app.getHttpServer()).get('/feedback?limit=1&offset=2');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(2);
    expect(result.body.items).toHaveLength(1);
  });

  it('/feedback (GET) with search by rating should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback?rating=${body.rating}`);
    expect(result.status).toBe(200);
  });

  it('/feedback (GET) with search by rating should return 1 feedback', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback?rating=${body.rating}`);
    expect(result.body.totalResults).toBe(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/feedback (GET) with search by rating should return the feedback that has the rating', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback?rating=${body.rating}`);
    result.body.items.forEach((element) => {
      expect(element.rating).toBe(body.rating);
    });
  });

  it('/feedback (GET) with search by storeId should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback?storeId=${storeId}`);
    expect(result.status).toBe(200);
  });

  it('/feedback (GET) with search by storeId should return 1 feedback', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback?storeId=${storeId}`);
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/feedback (GET) with search by mechanicId should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback?mechanicId=${mechanicId}`);
    expect(result.status).toBe(200);
  });

  it('/feedback (GET) with search by mechanicId should return 1 feedback', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback?mechanicId=${mechanicId}`);
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/feedback (GET) with search by clientId should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback?clientId=${clientId}`);
    expect(result.status).toBe(200);
  });

  it('/feedback (GET) with search by clientId should return 1 feedback', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback?clientId=${clientId}`);
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/feedback (GET) with clientId that doesnt exist should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/feedback?clientId=john');
    expect(result.status).toBe(400);
  });

  it('/feedback (GET) with clientId that doesnt exist should return no feedback', async () => {
    const result = await request(app.getHttpServer()).get('/feedback?clientId=john');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual(['clientId must be a UUID']);
  });

  it('/feedback (GET) with invalid limit should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/feedback?limit=af');
    expect(result.status).toBe(400);
  });

  it('/feedback (GET) with invalid limit should return the validation error', async () => {
    const result = await request(app.getHttpServer()).get('/feedback?limit=af');
    expect(result.body.message).toEqual(['limit must be a number conforming to the specified constraints']);
    expect(result.body.statusCode).toBe(400);
    expect(result.body.error).toBe('Bad Request');
  });
});
