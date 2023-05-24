import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import {
  updateInvalidFeedback,
  updateValidFeedback,
  validFeedback
} from '../utils/factories/feedback/feedback.factory';
import DatabaseModule from '../../src/database/database.module';
import StoreModule from '../../src/store/store.module';
import FeedbackModule from '../../src/feedback/feedback.module';
import ServiceModule from '../../src/service/service.module';
import { validStore } from '../utils/factories/store/store.factory';
import ClientModule from '../../src/client/client.module';
import BikeModule from '../../src/bike/bike.module';
import MechanicModule from '../../src/mechanic/mechanic.module';
import { validClient } from '../utils/factories/client/client.factory';
import { validBike } from '../utils/factories/bike/bike.factory';
import { validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import { validService } from '../utils/factories/service/service.factory';
import { feedbackNotFound } from '../../src/utils/constants/errorMessages';

describe('Feedback UPDATE (e2e)', () => {
  let app: INestApplication;
  let feedbackId: string;

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
    feedbackId = resultFeedBack.body.feedbackId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/feedback (PATCH) with valid data should return status 200', async () => {
    const result = await request(app.getHttpServer()).patch(`/feedback/${feedbackId}`).send(updateValidFeedback());
    expect(result.status).toBe(200);
  });

  it('/feedback (PATCH) with valid data should return success', async () => {
    const result = await request(app.getHttpServer()).patch(`/feedback/${feedbackId}`).send(updateValidFeedback());
    expect(result.body.status).toBe('success');
  });

  it('/feedback (PATCH) with non existing id should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch('/feedback/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidFeedback());
    expect(result.status).toBe(404);
  });

  it('/feedback (PATCH) ith non existing id should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch('/feedback/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidFeedback());
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(feedbackNotFound);
  });

  it('/feedback (PATCH) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch(`/feedback/${feedbackId}`).send(updateInvalidFeedback);
    expect(result.status).toBe(400);
  });

  it('/feedback (PATCH) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).patch(`/feedback/${feedbackId}`).send(updateInvalidFeedback);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'rating must not be less than 1',
      'rating must not be greater than 5',
      'rating must be a number conforming to the specified constraints',
      'description must be a string'
    ]);
  });

  it('/feedback (PATCH) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch('/feedback/1519748dsa4a').send(updateValidFeedback());
    expect(result.status).toBe(400);
  });

  it('/feedback (PATCH) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).patch('/feedback/1519748dsa4a').send(updateValidFeedback());
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });
});
