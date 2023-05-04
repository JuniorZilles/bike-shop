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
import UpdatePartDto from './dto/update-part.dto';
import { partNotFound } from '../utils/constants/errorMessages';

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

  const updatePartDto: UpdatePartDto = {
    storeId: generatedStoreId,
    manufacturer: 'Levorin',
    displayName: 'Pneu mountain 29',
    isActive: true
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
      const part = parts.find((item) => item.partId === where.partId);
      return part;
    }),
    findAndCount: jest.fn(({ where }) => {
      const keys = Object.keys(where);
      if (keys.length > 1) {
        const part = parts.filter(
          (item) =>
            item.isActive === where.isActive &&
            (item.displayName.includes(where.displayName?.value?.replace(/%/g, '')) ||
              item.manufacturer.includes(where.manufacturer?.value?.replace(/%/g, '')))
        );
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
        index = parts.findIndex((item) => item.partId === condition);
      }
      if (index >= 0) {
        parts[index] = { ...parts[index], ...entity };
      }
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
    parts = [];
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

  describe('Update', () => {
    let partId: string;
    beforeEach(async () => {
      const part = await service.create(createPartDto);
      partId = part.partId;
    });
    it('should update a part for the provided data', async () => {
      await service.update(partId, updatePartDto);
    });

    it('when doing a update for a part with invalid partId should return an not found error', async () => {
      try {
        await service.update('feb933a0-bb89-4d2d-a83d-a7ff83cd6334', updatePartDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Store or Part Not Found');
      }
    });

    it('when doing a update for a part with invalid storeId should return an not found error', async () => {
      try {
        await service.update(partId, { ...updatePartDto, storeId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Store or Part Not Found');
      }
    });
  });

  describe('Find By Id', () => {
    let part: Part;
    beforeEach(async () => {
      part = await service.create(createPartDto);
    });

    it('when searching for a part should return the provided data', async () => {
      const result = await service.findOne(part.partId);
      expect(result).toHaveProperty('storeId');
      expect(result).toHaveProperty('partId');
      expect(result).toHaveProperty('manufacturer');
      expect(result).toHaveProperty('displayName');
      expect(result).toHaveProperty('isActive');
    });

    it('when searching for a part should return same data received from create', async () => {
      const result = await service.findOne(part.partId);
      expect(result.storeId).toBe(part.storeId);
      expect(result.partId).toBe(part.partId);
      expect(result.manufacturer).toBe(part.manufacturer);
      expect(result.displayName).toBe(part.displayName);
      expect(result.isActive).toBe(part.isActive);
    });

    it('when searching for a part with invalid partId should return an not found error', async () => {
      try {
        await service.findOne('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Part Not Found');
      }
    });
  });

  describe('Find all', () => {
    beforeEach(async () => {
      await service.create(createPartDto);
    });

    it('should find all parts', async () => {
      const result = await service.findAll({});
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it('should find parts when searching by manufacturers Shimano', async () => {
      const result = await service.findAll({ manufacturer: 'Shimano' });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it(`should find parts when searching by storeId ${generatedStoreId}`, async () => {
      const result = await service.findAll({ storeIds: generatedStoreId });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it('should find parts when searching by displayName', async () => {
      const result = await service.findAll({ displayName: 'Freio' });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it('should not find parts when searching by displayName that isnt registered', async () => {
      const result = await service.findAll({ displayName: 'Pneu' });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(0);
    });
  });

  describe('Remove', () => {
    it('should do a soft remove for the requested part', async () => {
      const result = await service.create(createPartDto);
      await service.remove(result.partId);
    });

    it('should generate an error if the passed partId is not present in DB', async () => {
      try {
        await service.remove('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(partNotFound);
      }
    });
  });
});
