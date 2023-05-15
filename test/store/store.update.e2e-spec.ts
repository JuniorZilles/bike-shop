import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import StoreModule from '../../src/store/store.module';
import { updateInvalidStore, updateValidStore, validStore } from '../utils/factories/store/store.factory';
import DatabaseModule from '../../src/database/database.module';
import Store from '../../src/store/entities/store.entity';
import { storeNotFound } from '../../src/utils/constants/errorMessages';

describe('Store UPDATE (e2e)', () => {
  let app: INestApplication;
  let body: Store;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StoreModule, DatabaseModule]
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

    const result = await request(app.getHttpServer()).post('/store').send(validStore());
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/store (PATCH) with valid data should return status 200', async () => {
    const result = await request(app.getHttpServer()).patch(`/store/${body.storeId}`).send(updateValidStore());
    expect(result.status).toBe(200);
  });

  it('/store (PATCH) with valid data should return success', async () => {
    const result = await request(app.getHttpServer()).patch(`/store/${body.storeId}`).send(updateValidStore());
    expect(result.body.status).toBe('success');
  });

  it('/store (PATCH) with non existing id should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch('/store/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidStore());
    expect(result.status).toBe(404);
  });

  it('/store (PATCH) ith non existing id should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch('/store/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidStore());
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(storeNotFound);
  });

  it('/store (PATCH) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch(`/store/${body.storeId}`).send(updateInvalidStore);
    expect(result.status).toBe(400);
  });

  it('/store (PATCH) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).patch(`/store/${body.storeId}`).send(updateInvalidStore);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'state must be one of the following values: ',
      'phone must be a valid phone number'
    ]);
  });

  it('/store (PATCH) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch('/store/1519748dsa4a').send(updateValidStore());
    expect(result.status).toBe(400);
  });

  it('/store (PATCH) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).patch('/store/1519748dsa4a').send(updateValidStore());
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });
});
