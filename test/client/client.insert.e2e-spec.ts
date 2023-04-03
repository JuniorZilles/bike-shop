import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import ClientModule from '../../src/client/client.module';
import { validClient } from '../utils/factories/client/client.factory';
import DatabaseModule from '../../src/database/database.module';

describe('Client (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ClientModule, DatabaseModule]
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

  it('/client (POST) with valid data should return status 201', async () => {
    const result = await request(app.getHttpServer()).post('/client').send(validClient);
    expect(result.status).toBe(201);
  });
});
