import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import PartModule from '../../src/part/part.module';
import DatabaseModule from '../../src/database/database.module';
import { validPart } from '../utils/factories/part/part.factory';
import Part from '../../src/part/entities/part.entity';
import { validStore } from '../utils/factories/store/store.factory';
import StoreModule from '../../src/store/store.module';

describe('Part GET ALL (e2e)', () => {
  let app: INestApplication;
  let body: Part;
  let count: number;

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
    const promises = [];

    const resultStore = await request(app.getHttpServer()).post('/store').send(validStore());

    for (let i = 0; i < 10; i += 1) {
      promises.push(request(app.getHttpServer()).post('/part').send(validPart(resultStore.body?.storeId)));
    }
    const responses = await Promise.all(promises);
    count = responses.filter((element) => element.status === 201).length + 1;
    const result = await request(app.getHttpServer()).post('/part').send(validPart(resultStore.body?.storeId));
    body = result.body;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/part (GET) should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/part');
    expect(result.status).toBe(200);
  });

  it(`/part (GET) should return all ${count} parts inserted`, async () => {
    const result = await request(app.getHttpServer()).get('/part');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(count);
  });

  it('/part (GET) with limit 1 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/part?limit=1');
    expect(result.status).toBe(200);
  });

  it('/part (GET) with limit 1 should return 1 part', async () => {
    const result = await request(app.getHttpServer()).get('/part?limit=1');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/part (GET) with limit 1 and offset 2 should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/part?limit=1&offset=2');
    expect(result.status).toBe(200);
  });

  it('/part (GET) with limit 1 and offset 2 should return 1 part', async () => {
    const result = await request(app.getHttpServer()).get('/part?limit=1&offset=2');
    expect(result.body.totalResults).toBe(count);
    expect(result.body.limit).toBe(1);
    expect(result.body.offset).toBe(2);
    expect(result.body.items).toHaveLength(1);
  });

  it('/part (GET) with search by displayName should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/part?displayName=${body.displayName}`);
    expect(result.status).toBe(200);
  });

  it('/part (GET) with search by displayName should return 1 part', async () => {
    const result = await request(app.getHttpServer()).get(`/part?displayName=${body.displayName}`);
    expect(result.body.totalResults).toBe(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/part (GET) with search by displayName should return the part that has the displayName', async () => {
    const result = await request(app.getHttpServer()).get(`/part?displayName=${body.displayName}`);
    expect(result.body.items[0].displayName).toBe(body.displayName);
  });

  it('/part (GET) with search by manufacturer should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/part?manufacturer=${body.manufacturer}`);
    expect(result.status).toBe(200);
  });

  it('/part (GET) with search by manufacturer should return 1 part', async () => {
    const result = await request(app.getHttpServer()).get(`/part?manufacturer=${body.manufacturer}`);
    expect(result.body.totalResults).toBe(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(1);
  });

  it('/part (GET) with search by manufacturer should return the part that has the manufacturer', async () => {
    const result = await request(app.getHttpServer()).get(`/part?manufacturer=${body.manufacturer}`);
    expect(result.body.items[0].manufacturer).toBe(body.manufacturer);
  });

  it('/part (GET) with search by part of displayName should return status 200', async () => {
    const result = await request(app.getHttpServer()).get(`/part?displayName=${body.displayName.split(' ')[0]}`);
    expect(result.status).toBe(200);
  });

  it('/part (GET) with search by part of displayName should return at least one part', async () => {
    const result = await request(app.getHttpServer()).get(`/part?displayName=${body.displayName.split(' ')[0]}`);
    expect(result.body.totalResults).toBeGreaterThanOrEqual(1);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items.length).toBeGreaterThanOrEqual(1);
  });

  it('/part (GET) with search by part of displayName should return the parts that have the same displayName part', async () => {
    const partName = body.displayName.split(' ')[0];
    const result = await request(app.getHttpServer()).get(`/part?displayName=${partName}`);
    result.body.items.forEach((element: Part) => {
      expect(element.displayName).toContain(partName);
    });
  });

  it('/part (GET) with manufacturer that doesnt exist should return status 200', async () => {
    const result = await request(app.getHttpServer()).get('/part?manufacturer=john');
    expect(result.status).toBe(200);
  });

  it('/part (GET) with manufacturer that doesnt exist should return no part', async () => {
    const result = await request(app.getHttpServer()).get('/part?manufacturer=john');
    expect(result.body.totalResults).toBe(0);
    expect(result.body.limit).toBe(20);
    expect(result.body.offset).toBe(0);
    expect(result.body.items).toHaveLength(0);
  });

  it('/part (GET) with invalid limit should return status 400', async () => {
    const result = await request(app.getHttpServer()).get('/part?limit=af');
    expect(result.status).toBe(400);
  });

  it('/part (GET) with invalid limit should return the validation error', async () => {
    const result = await request(app.getHttpServer()).get('/part?limit=af');
    expect(result.body.message).toEqual(['limit must be a number conforming to the specified constraints']);
    expect(result.body.statusCode).toBe(400);
    expect(result.body.error).toBe('Bad Request');
  });
});
