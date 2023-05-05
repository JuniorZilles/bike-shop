import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import BatchService from './batch.service';
import { MockType } from '../utils/test/mocktype';
import CreateBatchDto from './dto/create-batch.dto';
import Batch from './entities/batch.entity';
import BatchRepository from './repository/implementation/BatchRepository';
import UpdateBatchDto from './dto/update-batch.dto';

describe('BatchService', () => {
  let service: BatchService;
  let batchs: Batch[] = [];
  const generatedPartId = randomUUID();

  const createBatchDto: CreateBatchDto = {
    items: [
      {
        nf: '81486881713553303413365577369865103857553685108450',
        price: 15.99,
        qtd: 10,
        unit: 'pc'
      }
    ]
  };
  const updateBatchDto: UpdateBatchDto = {
    nf: '81486881713553303413365577369865103857553685108450',
    price: 19.99,
    qtd: 15,
    unit: 'Kg'
  };

  const batchRepositoryMock: () => MockType<Repository<Batch>> = jest.fn(() => ({
    create: jest.fn((entity) => ({
      ...entity,
      batchId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    })),
    save: jest.fn((entity) => {
      batchs.push(...entity);
      return entity;
    }),
    update: jest.fn((condition, entity) => {
      let index = -1;
      const { batchId, partId } = condition;
      index = batchs.findIndex((item) => item.batchId === batchId && item.partId === partId);
      if (index >= 0) {
        batchs[index] = { ...batchs[index], ...entity };
      }
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
    batchs = [];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // {
        //   provide: getRepositoryToken(Store),
        //   useFactory: jest.fn()
        // },
        // StoreRepository,
        // {
        //   provide: getRepositoryToken(Part),
        //   useFactory: jest.fn()
        // },
        // PartRepository,
        {
          provide: getRepositoryToken(Batch),
          useFactory: batchRepositoryMock
        },
        BatchRepository,
        BatchService
      ]
    }).compile();

    service = module.get<BatchService>(BatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have CRUD operations', () => {
    expect(service.create).toBeDefined();
    expect(service.update).toBeDefined();
  });

  describe('Insert', () => {
    it('should insert a batch for the provided data', async () => {
      const store = await service.create(generatedPartId, createBatchDto);
      expect(store).toBeDefined();
      expect(store.length).toEqual(createBatchDto.items.length);
    });

    it('when doing a insert a batch will receive a id in the returning payload', async () => {
      const stores = await service.create(generatedPartId, createBatchDto);
      stores.forEach((store) => {
        expect(store).toBeDefined();
        expect(store).toHaveProperty('batchId');
        expect(store).toHaveProperty('unit');
        expect(store).toHaveProperty('nf');
        expect(store).toHaveProperty('price');
        expect(store).toHaveProperty('qtd');
      });
    });

    it('when doing a insert a batch will receive same data send in the returning payload', async () => {
      const stores = await service.create(generatedPartId, createBatchDto);
      stores.forEach((store, index) => {
        expect(store.nf).toBe(createBatchDto.items[index].nf);
        expect(store.price).toBe(createBatchDto.items[index].price);
        expect(store.batchId).toBeDefined();
        expect(store.qtd).toBe(createBatchDto.items[index].qtd);
        expect(store.unit).toBe(createBatchDto.items[index].unit);
      });
    });
  });

  describe('Update', () => {
    let batchId: string;
    beforeEach(async () => {
      const batch = await service.create(generatedPartId, createBatchDto);
      batchId = batch[0].batchId;
    });
    it('should update a batch for the provided data', async () => {
      await service.update(generatedPartId, batchId, updateBatchDto);
    });

    it('when doing a update for a batch with invalid batchId should return an not found error', async () => {
      try {
        await service.update(generatedPartId, 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334', updateBatchDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Part or Batch Not Found');
      }
    });

    it('when doing a update for a batch with invalid partId should return an not found error', async () => {
      try {
        await service.update('feb933a0-bb89-4d2d-a83d-a7ff83cd6334', batchId, updateBatchDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Part or Batch Not Found');
      }
    });
  });
});
