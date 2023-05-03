import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import PartService from './part.service';
import { MockType } from '../utils/test/mocktype';
import Store from '../store/entities/store.entity';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import Part from './entities/part.entity';
import PartRepository from './repository/implementation/PartRepository';
import CreatePartDto from './dto/create-part.dto';

describe('PartService', () => {
  let service: PartService;
  const generatedStoreId = randomUUID();
  const stores: Store[] = [
    {
      storeId: generatedStoreId,
      city: 'Dois Irmãos',
      complement: 'em frente ao posto shell',
      displayName: 'Top Bike',
      email: 'topbike@mail.com',
      neighborhood: 'centro',
      number: '300',
      street: 'Av. Irineu Becker',
      phone: '+55 51 99173-9999',
      state: 'RS',
      zipCode: '93950-000',
      password: 'asdas6d4as5d4a65d4g354as',
      latitude: -29.579647375868305,
      longitude: -51.089799222713715,
      isActive: true
    }
  ];
  let parts: Part[] = [];

  const createPartDto: CreatePartDto = {
    storeId: generatedStoreId,
    manufacturer: 'Shimano',
    displayName: 'Par Freio MT 200'
  };

  const storeRepositoryMock: () => MockType<Repository<Store>> = jest.fn(() => ({
    findOne: jest.fn(({ where }) => {
      const store = stores.find((item) => item.storeId === where.storeId);
      return store;
    })
  }));

  const partRepositoryMock: () => MockType<Repository<Part>> = jest.fn(() => ({
    create: jest.fn((entity) => ({
      ...entity,
      partId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    })),
    findOne: jest.fn(({ where }) => {
      const part = parts.find((item) => item.storeId === where.storeId);
      return part;
    }),
    findAndCount: jest.fn(({ where }) => {
      const keys = Object.keys(where);
      if (keys.length > 1) {
        const part = parts.filter((item) => item.isActive === where.isActive);
        return [part, part.length];
      }
      return [parts, parts.length];
    }),
    find: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
    save: jest.fn((entity) => {
      parts.push(entity);
      return entity;
    }),
    update: jest.fn((condition, entity) => {
      let index = -1;
      const { storeId, partId } = condition;
      if (storeId && partId) {
        index = parts.findIndex((item) => item.storeId === storeId && item.partId === partId);
      } else {
        index = parts.findIndex((item) => item.storeId === condition);
      }
      if (index >= 0) {
        parts[index] = { ...parts[index], ...entity };
      }
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Store),
          useFactory: storeRepositoryMock
        },
        StoreRepository,
        {
          provide: getRepositoryToken(Part),
          useFactory: partRepositoryMock
        },
        PartRepository,
        PartService
      ]
    }).compile();

    service = module.get<PartService>(PartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have CRUD operations', () => {
    expect(service.create).toBeDefined();
    expect(service.findAll).toBeDefined();
    expect(service.findOne).toBeDefined();
    expect(service.remove).toBeDefined();
    expect(service.update).toBeDefined();
  });

  describe('Insert', () => {
    it('should insert a part for the provided data', async () => {
      const store = await service.create(createPartDto);
      expect(store).toBeDefined();
    });

    it('when doing a insert a part will receive a id in the returning payload', async () => {
      const store = await service.create(createPartDto);
      expect(store).toBeDefined();
      expect(store).toHaveProperty('partId');
      expect(store).toHaveProperty('displayName');
      expect(store).toHaveProperty('manufacturer');
      expect(store).toHaveProperty('storeId');
      expect(store).toHaveProperty('isActive');
    });

    it('when doing a insert a part will receive same data send in the returning payload', async () => {
      const store = await service.create(createPartDto);

      expect(store.displayName).toBe(createPartDto.displayName);
      expect(store.manufacturer).toBe(createPartDto.manufacturer);
      expect(store.partId).toBeDefined();
      expect(store.storeId).toBe(createPartDto.storeId);
      expect(store.isActive).toBe(true);
    });

    it('when doing a insert a part with invalid storeId should return an not found error', async () => {
      try {
        await service.create({ ...createPartDto, storeId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Store Not Found');
      }
    });
  });
});
