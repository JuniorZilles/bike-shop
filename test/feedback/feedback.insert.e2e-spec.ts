import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import FeedbackModule from '../../src/feedback/feedback.module';
import { invalidFeedback, validFeedback } from '../utils/factories/feedback/feedback.factory';
import ServiceModule from '../../src/service/service.module';
import { validService } from '../utils/factories/service/service.factory';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';
import ClientModule from '../../src/client/client.module';
import BikeModule from '../../src/bike/bike.module';
import PartModule from '../../src/part/part.module';
import MechanicModule from '../../src/mechanic/mechanic.module';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import { serviceNotFound } from '../../src/utils/constants/errorMessages';

describe('Feedback INSERT (e2e)', () => {
  let app: INestApplication;
  let serviceId: string;

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
    const mechanicId = resultMechanic.body?.mechanicId;
    const resultService = await request(app.getHttpServer())
      .post('/service')
      .send(validService({ storeId, mechanicId, bikeId, clientId }));
    serviceId = resultService.body.serviceId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/feedback (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer()).post('/feedback').send(validFeedback(serviceId));
    expect(result.status).toBe(201);
  });

  it('/feedback (POST) with valid data should return the data', async () => {
    const validFeedbackData = validFeedback(serviceId);
    const result = await request(app.getHttpServer()).post('/feedback').send(validFeedbackData);
    const feedback = result.body;
    expect(feedback.feedbackId).toBeDefined();
    expect(feedback.createdAt).toBeDefined();
    expect(feedback.updatedAt).toBeDefined();
    expect(feedback.description).toBe(validFeedbackData.description);
    expect(feedback.rating).toEqual(validFeedbackData.rating);
    expect(feedback.serviceId).toBe(validFeedbackData.serviceId);
  });

  it('/feedback (POST) with invalid serviceId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .post('/feedback')
      .send(validFeedback('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.status).toBe(404);
  });

  it('/feedback (POST) with invalid serviceId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post('/feedback')
      .send(validFeedback('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(serviceNotFound);
  });

  it('/feedback (POST) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).post('/feedback').send(invalidFeedback);
    expect(result.status).toBe(400);
  });

  it('/feedback (POST) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).post('/feedback').send(invalidFeedback);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'serviceId must be a UUID',
      'serviceId must be a string',
      'serviceId should not be empty',
      'rating must not be less than 1',
      'rating must not be greater than 5',
      'rating must be a number conforming to the specified constraints',
      'description must be a string'
    ]);
  });
});
