import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import { updateInvalidPart, updateValidPart, validPart } from '../utils/factories/part/part.factory';
import DatabaseModule from '../../src/database/database.module';
import Part from '../../src/part/entities/part.entity';
import StoreModule from '../../src/store/store.module';
import { validStore } from '../utils/factories/store/store.factory';

describe('Part UPDATE (e2e)', () => {
  let app: INestApplication;
  let body: Part;
  let storeId: string;

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
    storeId = resultStore.body?.storeId;
    const result = await request(app.getHttpServer()).post('/part').send(validPart(storeId));
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/part (PATCH) with valid data should return status 200', async () => {
    const result = await request(app.getHttpServer()).patch(`/part/${body.partId}`).send(updateValidPart(storeId));
    expect(result.status).toBe(200);
  });

  it('/part (PATCH) with valid data should return success', async () => {
    const result = await request(app.getHttpServer()).patch(`/part/${body.partId}`).send(updateValidPart(storeId));
    expect(result.body.status).toBe('success');
  });

  it('/part (PATCH) with invalid storeId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${body.partId}`)
      .send(updateValidPart('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.status).toBe(404);
  });

  it('/part (PATCH) with invalid storeId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch(`/part/${body.partId}`)
      .send(updateValidPart('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Store or Part Not Found');
  });

  it('/part (PATCH) with non existing id should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .patch('/part/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidPart(storeId));
    expect(result.status).toBe(404);
  });

  it('/part (PATCH) ith non existing id should return an error', async () => {
    const result = await request(app.getHttpServer())
      .patch('/part/feb933a0-bb89-4d2d-a83d-a7ff83cd6334')
      .send(updateValidPart(storeId));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe('Store or Part Not Found');
  });

  it('/part (PATCH) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch(`/part/${body.partId}`).send(updateInvalidPart);
    expect(result.status).toBe(400);
  });

  it('/part (PATCH) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).patch(`/part/${body.partId}`).send(updateInvalidPart);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'storeId must be a UUID',
      'storeId must be a string',
      'storeId should not be empty',
      'manufacturer must be a string',
      'displayName must be a string',
      'isActive must be a boolean value'
    ]);
  });

  it('/part (PATCH) with invalid ID should return status 400', async () => {
    const result = await request(app.getHttpServer()).patch('/part/1519748dsa4a').send(updateValidPart(storeId));
    expect(result.status).toBe(400);
  });

  it('/part (PATCH) with invalid ID should return validation error', async () => {
    const result = await request(app.getHttpServer()).patch('/part/1519748dsa4a').send(updateValidPart(storeId));
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual('Validation failed (uuid is expected)');
  });
});
