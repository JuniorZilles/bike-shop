import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import { invalidBatch, validBatch } from '../utils/factories/part/batch.factory';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';
import { partNotFound } from '../../src/utils/constants/errorMessages';
import { validPart } from '../utils/factories/part/part.factory';

describe('Batch INSERT (e2e)', () => {
  let app: INestApplication;
  const storeData = validStore();
  let partId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StoreModule, PartModule, DatabaseModule]
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

    const resultStore = await request(app.getHttpServer()).post('/store').send(storeData);
    const result = await request(app.getHttpServer()).post('/part').send(validPart(resultStore.body?.storeId));
    partId = result.body?.partId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/batch (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer()).post(`/part/${partId}/batch`).send(validBatch());
    expect(result.status).toBe(201);
  });

  it('/batch (POST) with valid data should return the data', async () => {
    const validBatchData = validBatch();
    const result = await request(app.getHttpServer()).post(`/part/${partId}/batch`).send(validBatchData);
    const batch = result.body;

    expect(batch.length).toBe(validBatchData.items.length);
    for (let i = 0; i < batch.length; i += 1) {
      expect(batch[i].batchId).toBeDefined();
      expect(batch[i].partId).toBe(partId);
      expect(batch[i].createdAt).toBeDefined();
      expect(batch[i].updatedAt).toBeDefined();
      expect(batch[i].nf).toBe(validBatchData.items[i].nf);
      expect(batch[i].price).toBe(validBatchData.items[i].price);
      expect(batch[i].unit).toBe(validBatchData.items[i].unit);
      expect(batch[i].qtd).toBe(validBatchData.items[i].qtd);
    }
  });

  it('/batch (POST) with invalid partId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .post('/part/3716ad7c-eac1-47b0-9e59-7a10d989ded4/batch')
      .send(validBatch());
    expect(result.status).toBe(404);
  });

  it('/batch (POST) with invalid partId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post('/part/3716ad7c-eac1-47b0-9e59-7a10d989ded4/batch')
      .send(validBatch());
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(partNotFound);
  });

  it('/batch (POST) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).post(`/part/${partId}/batch`).send(invalidBatch);
    expect(result.status).toBe(400);
  });

  it('/batch (POST) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).post(`/part/${partId}/batch`).send(invalidBatch);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'items.0.qtd must be a number conforming to the specified constraints',
      'items.0.price must be a number conforming to the specified constraints',
      'items.0.price should not be empty',
      'items.1.qtd must be a number conforming to the specified constraints',
      'items.1.qtd should not be empty',
      'items.1.unit must be a string',
      'items.1.unit should not be empty',
      'items.1.price must be a number conforming to the specified constraints'
    ]);
  });
});
