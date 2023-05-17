import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import { invalidPart, validPart } from '../utils/factories/part/part.factory';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';
import { storeNotFound } from '../../src/utils/constants/errorMessages';

describe('Part INSERT (e2e)', () => {
  let app: INestApplication;
  const storeData = validStore();
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

    const result = await request(app.getHttpServer()).post('/store').send(storeData);
    storeId = result.body?.storeId;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/part (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer()).post('/part').send(validPart(storeId));
    expect(result.status).toBe(201);
  });

  it('/part (POST) with valid data should return the data', async () => {
    const validPartData = validPart(storeId);
    const result = await request(app.getHttpServer()).post('/part').send(validPartData);
    const part = result.body;
    expect(part.partId).toBeDefined();
    expect(part.createdAt).toBeDefined();
    expect(part.updatedAt).toBeDefined();
    expect(part.storeId).toBe(validPartData.storeId);
    expect(part.displayName).toBe(validPartData.displayName);
    expect(part.manufacturer).toBe(validPartData.manufacturer);
    expect(part.isActive).toBe(true);
  });

  it('/part (POST) with invalid storeId should return status 404', async () => {
    const result = await request(app.getHttpServer())
      .post('/part')
      .send(validPart('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.status).toBe(404);
  });

  it('/part (POST) with invalid storeId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post('/part')
      .send(validPart('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(storeNotFound);
  });

  it('/part (POST) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).post('/part').send(invalidPart);
    expect(result.status).toBe(400);
  });

  it('/part (POST) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).post('/part').send(invalidPart);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'storeId must be a UUID',
      'storeId must be a string',
      'storeId should not be empty',
      'manufacturer must be a string',
      'displayName must be a string'
    ]);
  });
});
