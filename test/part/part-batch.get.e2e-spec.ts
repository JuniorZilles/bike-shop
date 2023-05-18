import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import { validBatch } from '../utils/factories/part/batch.factory';
import DatabaseModule from '../../src/database/database.module';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';
import { validPart } from '../utils/factories/part/part.factory';
import Part from '../../src/part/entities/part.entity';

describe('Part Batch GET (e2e)', () => {
  let app: INestApplication;
  const storeData = validStore();
  let body: Part;
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
    const resultPart = await request(app.getHttpServer()).post('/part').send(validPart(resultStore.body?.storeId));
    partId = resultPart.body?.partId;
    const result = await request(app.getHttpServer()).post(`/part/${partId}/batch`).send(validBatch());
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/part (GET) with search by unit should status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/part?unit=${body[0].unit}`);
    expect(result.status).toBe(200);
  });

  it('/part (GET) with search by unit should return 1 part', async () => {
    const result = await request(app.getHttpServer()).get(`/part?unit=${body[0].unit}`);
    expect(result.body.totalResults).toBe(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/part (GET) with search by unit should return the part that has the unit', async () => {
    const result = await request(app.getHttpServer()).get(`/part?unit=${body[0].unit}`);
    expect(result.body.items[0].batch[0].unit).toBe(body[0].unit);
  });

  it('/part (GET) with search by nf should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/part?nf=${body[0].nf}`);
    expect(result.status).toBe(200);
  });

  it('/part (GET) with search by nf should return the part that has the nf', async () => {
    const result = await request(app.getHttpServer()).get(`/part?nf=${body[0].nf}`);
    expect(result.body.items[0].batch[0].nf).toBe(body[0].nf);
  });

  it('/part (GET) with search by nf should return 1 part', async () => {
    const result = await request(app.getHttpServer()).get(`/part?nf=${body[0].nf}`);
    expect(result.body.totalResults).toBe(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/part (GET) with search by part id should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/part/${partId}`);
    expect(result.status).toBe(200);
  });

  it('/part (GET) with search by part id should return the part data with its batchs', async () => {
    const result = await request(app.getHttpServer()).get(`/part/${partId}`);
    expect(result.body.batch.length).toBeGreaterThanOrEqual(2);
  });
});
