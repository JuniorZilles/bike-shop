import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import StoreModule from '../../src/store/store.module';
import { invalidStore, validStore } from '../utils/factories/store/store.factory';
import DatabaseModule from '../../src/database/database.module';

describe('Store INSERT (e2e)', () => {
  let app: INestApplication;

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
  });

  afterEach(async () => {
    await app.close();
  });

  it('/store (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer()).post('/store').send(validStore());
    expect(result.status).toBe(201);
  });

  it('/store (POST) with valid data should return the data without the password', async () => {
    const validStoreData = validStore();
    const result = await request(app.getHttpServer()).post('/store').send(validStoreData);
    expect(result.body.email).toBe(validStoreData.email);
    expect(result.body.password).toBeUndefined();
    expect(result.body.city).toBe(validStoreData.city);
    expect(result.body.phone).toBe(validStoreData.phone);
    expect(result.body.complement).toBe(validStoreData.complement);
    expect(result.body.displayName).toBe(validStoreData.displayName);
    expect(result.body.latitude).toBe(validStoreData.latitude);
    expect(result.body.longitude).toBe(validStoreData.longitude);
    expect(result.body.neighborhood).toBe(validStoreData.neighborhood);
    expect(result.body.number).toBe(validStoreData.number);
    expect(result.body.zipCode).toBe(validStoreData.zipCode);
    expect(result.body.state).toBe(validStoreData.state);
    expect(result.body.street).toBe(validStoreData.street);
  });

  it('/store (POST) with duplicated email should return status 409', async () => {
    const validStoreData = validStore();
    await request(app.getHttpServer()).post('/store').send(validStoreData);
    const result = await request(app.getHttpServer())
      .post('/store')
      .send({ ...validStore(), email: validStoreData.email });
    expect(result.status).toBe(409);
  });

  it('/store (POST) with duplicated email should return an error', async () => {
    const validStoreData = validStore();
    await request(app.getHttpServer()).post('/store').send(validStoreData);
    const result = await request(app.getHttpServer())
      .post('/store')
      .send({ ...validStore(), email: validStoreData.email });
    expect(result.body.error).toBe('Conflict');
    expect(result.body.statusCode).toBe(409);
    expect(result.body.message).toBe('Email already in use');
  });

  it('/store (POST) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).post('/store').send(invalidStore);
    expect(result.status).toBe(400);
  });

  it('/store (POST) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).post('/store').send(invalidStore);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'email must be an email',
      'password is not strong enough',
      'latitude must be a latitude string or number',
      'longitude must be a longitude string or number',
      'state must be one of the following values: ',
      'phone must be a valid phone number'
    ]);
  });
});
