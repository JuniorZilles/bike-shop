import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import MechanicModule from '../../src/mechanic/mechanic.module';
import { invalidMechanic, validMechanic } from '../utils/factories/mechanic/mechanic.factory';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';
import { storeNotFound } from '../../src/utils/constants/errorMessages';

describe('Mechanic INSERT (e2e)', () => {
  let app: INestApplication;
  const storeData = validStore();
  let storeId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StoreModule, MechanicModule, DatabaseModule]
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

  it('/mechanic (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer()).post('/mechanic').send(validMechanic(storeId));
    expect(result.status).toBe(201);
  });

  it('/mechanic (POST) with valid data should return the data without the password', async () => {
    const validMechanicData = validMechanic(storeId);
    const result = await request(app.getHttpServer()).post('/mechanic').send(validMechanicData);
    const mechanic = result.body;
    expect(mechanic.password).toBeUndefined();
    expect(mechanic.storeId).toBe(validMechanicData.storeId);
    expect(mechanic.email).toBe(validMechanicData.email);
    expect(mechanic.name).toBe(validMechanicData.name);
    expect(mechanic.phone).toBe(validMechanicData.phone);
    expect(mechanic.isActive).toBe(true);
    expect(new Date(mechanic.hiringDate)).toEqual(validMechanicData.hiringDate);
  });

  it('/mechanic (POST) with invalid storeId should status 404', async () => {
    const result = await request(app.getHttpServer())
      .post('/mechanic')
      .send(validMechanic('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.status).toBe(404);
  });

  it('/mechanic (POST) with invalid storeId should return an error', async () => {
    const result = await request(app.getHttpServer())
      .post('/mechanic')
      .send(validMechanic('3716ad7c-eac1-47b0-9e59-7a10d989ded4'));
    expect(result.body.error).toBe('Not Found');
    expect(result.body.statusCode).toBe(404);
    expect(result.body.message).toBe(storeNotFound);
  });

  it('/mechanic (POST) with duplicated email should return status 409', async () => {
    const validMechanicData = validMechanic(storeId);
    await request(app.getHttpServer()).post('/mechanic').send(validMechanicData);
    const result = await request(app.getHttpServer())
      .post('/mechanic')
      .send({ ...validMechanic(storeId), email: validMechanicData.email });
    expect(result.status).toBe(409);
  });

  it('/mechanic (POST) with duplicated email should return an error', async () => {
    const validMechanicData = validMechanic(storeId);
    await request(app.getHttpServer()).post('/mechanic').send(validMechanicData);
    const result = await request(app.getHttpServer())
      .post('/mechanic')
      .send({ ...validMechanic(storeId), email: validMechanicData.email });
    expect(result.body.error).toBe('Conflict');
    expect(result.body.statusCode).toBe(409);
    expect(result.body.message).toBe('Email already in use');
  });

  it('/mechanic (POST) with invalid data should return status 400', async () => {
    const result = await request(app.getHttpServer()).post('/mechanic').send(invalidMechanic);
    expect(result.status).toBe(400);
  });

  it('/mechanic (POST) with invalid data should return the validation error', async () => {
    const result = await request(app.getHttpServer()).post('/mechanic').send(invalidMechanic);
    expect(result.body.error).toBe('Bad Request');
    expect(result.body.statusCode).toBe(400);
    expect(result.body.message).toEqual([
      'storeId must be a UUID',
      'storeId must be a string',
      'storeId should not be empty',
      'email must be an email',
      'password is not strong enough',
      'phone must be a valid phone number'
    ]);
  });
});
