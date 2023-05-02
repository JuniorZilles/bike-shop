import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PartService } from './part.service';
import { MockType } from '../utils/test/mocktype';
import Store from '../store/entities/store.entity';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import Part from './entities/part.entity';
import PartRepository from './repository/implementation/PartRepository';

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
});
