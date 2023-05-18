import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import { updateInvalidBatch, updateValidBatch, validBatch } from '../utils/factories/part/batch.factory';
import DatabaseModule from '../../src/database/database.module';
import StoreModule from '../../src/store/store.module';
import { validStore } from '../utils/factories/store/store.factory';
import { validPart } from '../utils/factories/part/part.factory';

describe('Batch UPDATE (e2e)', () => {
  let app: INestApplication;
  let partId: string;
  let batchId: string;

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

    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());
    const resultPart = await request(app.getHttpServer()).post('/part').send(validPart(resultStore.body?.storeId));
    partId = resultPart.body?.partId;
    const result = await request(app.getHttpServer()).post(`/part/${partId}/batch`).send(validBatch());
    batchId = result.body[0]?.batchId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/batch (PATCH) with valid data should return status 200', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${partId}/batch/${batchId}`)
      .send(updateValidBatch());
    expect(result.status).toBe(200);
  });

  it('/batch (PATCH) with valid data should return success', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${partId}/batch/${batchId}`)
      .send(updateValidBatch());
    expect(result.body.status).toBe('success');
  });

  it('/batch (PATCH) with invalid partId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/3716ad7c-eac1-47b0-9e59-7a10d989ded4/batch/${batchId}`)
      .send(updateValidBatch());
    expect(result.status).toBe(404);
  });

  it('/batch (PATCH) with invalid partId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/3716ad7c-eac1-47b0-9e59-7a10d989ded4/batch/${batchId}`)
      .send(updateValidBatch());
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Part or Batch Not Found');
  });

  it('/batch (PATCH) with non existing id should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${partId}/batch/feb933a0-bb89-4d2d-a83d-a7ff83cd6334`)
      .send(updateValidBatch());
    expect(result.status).toBe(404);
  });

  it('/batch (PATCH) ith non existing id should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${partId}/batch/feb933a0-bb89-4d2d-a83d-a7ff83cd6334`)
      .send(updateValidBatch());
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Part or Batch Not Found');
  });

  it('/batch (PATCH) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${partId}/batch/${batchId}`)
      .send(updateInvalidBatch);
    expect(result.status).toBe(400);
  });

  it('/batch (PATCH) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${partId}/batch/${batchId}`)
      .send(updateInvalidBatch);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'qtd must be a number conforming to the specified constraints',
      'unit must be a string',
      'price must be a number conforming to the specified constraints'
    ]);
  });

  it('/batch (PATCH) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${partId}/batch/1519748dsa4a`)
      .send(updateValidBatch());
    expect(result.status).toBe(400);
  });

  it('/batch (PATCH) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${partId}/batch/1519748dsa4a`)
      .send(updateValidBatch());
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });

  it('/batch (PATCH) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/265asd6as51256/batch/${batchId}`)
      .send(updateValidBatch());
    expect(result.status).toBe(400);
  });

  it('/batch (PATCH) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/265asd6as51256/batch/${batchId}`)
      .send(updateValidBatch());
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });
});
