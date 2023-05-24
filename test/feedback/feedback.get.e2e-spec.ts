import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';
import FeedbackModule from '../../src/feedback/feedback.module';
import ClientModule from '../../src/client/client.module';
import BikeModule from '../../src/bike/bike.module';
import ServiceModule from '../../src/service/service.module';
import MechanicModule from '../../src/mechanic/mechanic.module';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import { validService } from '../utils/factories/service/service.factory';
import { validFeedback } from '../utils/factories/feedback/feedback.factory';
import Feedback from '../../src/feedback/entities/feedback.entity';
import { feedbackNotFound } from '../../src/utils/constants/errorMessages';

describe('Feedback GET (e2e)', () => {
  let app: INestApplication;
  let body: Feedback;

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
    const { serviceId } = resultService.body;
    const resultFeedBack = await request(app.getHttpServer()).post('/feedback').send(validFeedback(serviceId));
    body = resultFeedBack.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/feedback (GET) with valid ID should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback/${body.feedbackId}`);
    expect(result.status).toBe(200);
  });

  it('/feedback (GET) with valid ID should return feedback data', async () => {
    const result = await request(app.getHttpServer()).get(`/feedback/${body.feedbackId}`);
    const feedback = result.body;

    expect(feedback.feedbackId).toBe(body.feedbackId);
    expect(feedback.createdAt).toBe(body.createdAt);
    expect(feedback.description).toBe(body.description);
    expect(feedback.rating).toBe(body.rating);
    expect(feedback.serviceId).toBe(body.serviceId);
    expect(feedback.updatedAt).toBe(body.updatedAt);
  });

  it('/feedback (GET) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/feedback/1519748dsa4a');
    expect(result.status).toBe(400);
  });

  it('/feedback (GET) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).get('/feedback/1519748dsa4a');
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/feedback (GET) with non existing ID should return status 404', async () => {
    const result = await request(app.getHttpServer()).get('/feedback/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.status).toBe(404);
  });

  it('/feedback (GET) with non existing ID should return not found error', async () => {
    const result = await request(app.getHttpServer()).get('/feedback/3716ad7c-eac1-47b0-9e59-7a10d989ded4');
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(feedbackNotFound);
  });
});
