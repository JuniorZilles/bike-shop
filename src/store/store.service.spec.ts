import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import StoreService from './store.service';
import CreateStoreDto from './dto/create-store.dto';
import Store from './entities/store.entity';
import StoreRepository from './repository/implementation/StoreRepository';
import { MockType } from '../utils/test/mocktype';
import UpdateStoreDto from './dto/update-store.dto';

describe('StoreService', () => {
  let service: StoreService;
  const createStoreDto: CreateStoreDto = {
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
    longitude: -51.089799222713715
  };

  const updateStoreDto: UpdateStoreDto = {
    displayName: 'Top Bike Dois Irmãos'
  };
  let stores: Store[] = [];

  const storeRepositoryMock: () => MockType<Repository<Store>> = jest.fn(() => ({
    create: jest.fn((entity) => ({
      ...entity,
      storeId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    })),
    findOne: jest.fn(({ where }) => {
      const store = stores.find((item) => item.storeId === where.storeId || item.email === where.email);
      return store;
    }),
    findAndCount: jest.fn(({ where }) => {
      if (Object.keys(where).length > 1) {
        const store = stores.filter(
          (item) =>
            item.isActive === where.isActive &&
            (item.displayName.includes(where.displayName?.value?.replace(/%/g, '')) ||
              item.phone.includes(where.phone?.value?.replace(/%/g, '')))
        );
        return [store, store.length];
      }
      return [stores, stores.length];
    }),
    find: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
    save: jest.fn((entity) => {
      const { password, ...rest } = entity;
      stores.push(rest);
      return rest;
    }),
    update: jest.fn((id, entity) => {
      const index = stores.findIndex((item) => item.storeId === id);
      stores[index] = { ...stores[index], ...entity };
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
    stores = [];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Store),
          useFactory: storeRepositoryMock
        },
        StoreRepository,
        StoreService
      ]
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have CRUD operations', () => {
    expect(service.create).toBeDefined();
    expect(service.findAll).toBeDefined();
    expect(service.findOne).toBeDefined();
    expect(service.update).toBeDefined();
  });

  describe('Insert', () => {
    it('should insert a store for the provided data', async () => {
      const store = await service.create(createStoreDto);
      expect(store).toBeDefined();
    });

    it('when doing a insert a store cannot receive its password', async () => {
      const store = await service.create(createStoreDto);
      expect(store).toBeDefined();
      expect(store).not.toHaveProperty('password');
    });

    it('when doing a insert a store will receive a id in the returning payload', async () => {
      const store = await service.create(createStoreDto);
      expect(store).toBeDefined();
      expect(store).toHaveProperty('storeId');
      expect(store).toHaveProperty('email');
      expect(store).toHaveProperty('displayName');
      expect(store).toHaveProperty('phone');
      expect(store).toHaveProperty('isActive');
      expect(store).toHaveProperty('street');
      expect(store).toHaveProperty('number');
      expect(store).toHaveProperty('complement');
      expect(store).toHaveProperty('latitude');
      expect(store).toHaveProperty('longitude');
      expect(store).toHaveProperty('city');
      expect(store).toHaveProperty('neighborhood');
      expect(store).toHaveProperty('state');
    });

    it('when doing a insert a store will receive same data send in the returning payload', async () => {
      const store = await service.create(createStoreDto);

      expect(store.displayName).toBe(createStoreDto.displayName);
      expect(store.email).toBe(createStoreDto.email);
      expect(store.street).toBe(createStoreDto.street);
      expect(store.number).toBe(createStoreDto.number);
      expect(store.complement).toBe(createStoreDto.complement);
      expect(store.latitude).toBe(createStoreDto.latitude);
      expect(store.longitude).toBe(createStoreDto.longitude);
      expect(store.city).toBe(createStoreDto.city);
      expect(store.neighborhood).toBe(createStoreDto.neighborhood);
      expect(store.state).toBe(createStoreDto.state);
      expect(store.phone).toBe(createStoreDto.phone);
      expect(store.isActive).toBe(true);
    });

    it('when doing a insert a store with same email it will return an conflict error', async () => {
      await service.create(createStoreDto);
      try {
        await service.create(createStoreDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.status).toBe(409);
        expect(e.message).toBe('Email already in use');
      }
    });
  });

  describe('Update', () => {
    it('should update a store for the provided data', async () => {
      const store = await service.create(createStoreDto);
      await service.update(store.storeId, updateStoreDto);
    });

    it('when doing a update with invalid store id', async () => {
      try {
        await service.update('feb933a0-bb89-4d2d-a83d-a7ff83cd6334', updateStoreDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Store Not Found');
      }
    });
  });

  describe('Find', () => {
    let insertStore: Store;
    beforeEach(async () => {
      insertStore = await service.create(createStoreDto);
    });

    it('should find a store with its storeId and be defined', async () => {
      const store = await service.findOne(insertStore.storeId);
      expect(store).toBeDefined();
    });

    it('should find a store with its storeId and return its data', async () => {
      const store = await service.findOne(insertStore.storeId);
      expect(store.storeId).toBe(insertStore.storeId);
      expect(store.email).toBe(insertStore.email);
      expect(store.displayName).toBe(insertStore.displayName);
      expect(store.city).toBe(insertStore.city);
      expect(store.phone).toBe(insertStore.phone);
      expect(store.complement).toBe(insertStore.complement);
      expect(store.latitude).toBe(insertStore.latitude);
      expect(store.longitude).toBe(insertStore.longitude);
      expect(store.neighborhood).toBe(insertStore.neighborhood);
      expect(store.number).toBe(insertStore.number);
      expect(store.state).toBe(insertStore.state);
      expect(store.street).toBe(insertStore.street);
      expect(store.isActive).toBe(insertStore.isActive);
    });

    it('should find a store with its storeId and not return the password', async () => {
      const store = await service.findOne(insertStore.storeId);
      expect(store).toBeDefined();
      expect(store).not.toHaveProperty('password');
    });

    it('should generate an error if the passed storeId is not present in DB', async () => {
      try {
        await service.findOne('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Store Not Found');
      }
    });
  });
});
