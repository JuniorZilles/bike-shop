import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import MechanicService from './mechanic.service';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import Store from '../store/entities/store.entity';
import Mechanic from './entities/mechanic.entity';
import MechanicRepository from './repository/implementation/MechanicRepository';
import { MockType } from '../utils/test/mocktype';
import CreateMechanicDto from './dto/create-mechanic.dto';
import UpdateMechanicDto from './dto/update-mechanic.dto';
import { emailInUse, mechanicNotFound, storeNotFound } from '../utils/constants/errorMessages';

describe('MechanicService', () => {
  let service: MechanicService;
  const generatedStoreId = randomUUID();

  const createMechanicDto: CreateMechanicDto = {
    email: 'john.doe@mail.com',
    hiringDate: new Date('2022-11-14'),
    name: 'John Doe',
    password: 'aksjdkasjmd65asd654',
    phone: '+55 12 94866-2978',
    storeId: generatedStoreId
  };

  const updateMechanicDto: UpdateMechanicDto = {
    phone: '+55 12 94866-2989',
    storeId: generatedStoreId
  };

  let mechanics: Mechanic[] = [];

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
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const storeRepositoryMock: () => MockType<Repository<Store>> = jest.fn(() => ({
    findOne: jest.fn(({ where }) => {
      const store = stores.find((item) => item.storeId === where.storeId && where.isActive === item.isActive);
      return store;
    })
  }));

  const mechanicRepositoryMock: () => MockType<Repository<Mechanic>> = jest.fn(() => ({
    create: jest.fn((entity) => ({
      ...entity,
      mechanicId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    })),
    findOne: jest.fn(({ where }) => {
      const mechanic = mechanics.find((item) => item.mechanicId === where.mechanicId || item.email === where.email);
      return mechanic;
    }),
    findAndCount: jest.fn(({ where }) => {
      if (Object.keys(where).length > 1) {
        const mechanic = mechanics.filter(
          (item) =>
            item.isActive === where.isActive &&
            (item.name.includes(where.name?.value?.replace(/%/g, '')) ||
              item.phone.includes(where.phone?.value?.replace(/%/g, '')) ||
              item.email.includes(where.email?.value?.replace(/%/g, '')))
        );
        return [mechanic, mechanic.length];
      }
      return [mechanics, mechanics.length];
    }),
    save: jest.fn((entity) => {
      const { password, ...rest } = entity;
      mechanics.push(rest);
      return rest;
    }),
    update: jest.fn((condition, entity) => {
      let index = -1;
      const { storeId, mechanicId } = condition;
      if (storeId && mechanicId) {
        index = mechanics.findIndex((item) => item.storeId === storeId && item.mechanicId === mechanicId);
      } else {
        index = mechanics.findIndex((item) => item.mechanicId === condition);
      }
      if (index >= 0) {
        mechanics[index] = { ...mechanics[index], ...entity };
      }
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
    mechanics = [];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Store),
          useFactory: storeRepositoryMock
        },
        StoreRepository,
        {
          provide: getRepositoryToken(Mechanic),
          useFactory: mechanicRepositoryMock
        },
        MechanicRepository,
        MechanicService
      ]
    }).compile();

    service = module.get<MechanicService>(MechanicService);
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
    it('should insert a mechanic for the provided data', async () => {
      const mechanic = await service.create(createMechanicDto);
      expect(mechanic).toBeDefined();
    });

    it('when doing a insert a mechanic cannot receive its password', async () => {
      const mechanic = await service.create(createMechanicDto);
      expect(mechanic).toBeDefined();
      expect(mechanic).not.toHaveProperty('password');
    });

    it('when doing a insert a mechanic will receive a id in the returning payload', async () => {
      const mechanic = await service.create(createMechanicDto);
      expect(mechanic).toBeDefined();
      expect(mechanic).toHaveProperty('mechanicId');
      expect(mechanic).toHaveProperty('email');
      expect(mechanic).toHaveProperty('name');
      expect(mechanic).toHaveProperty('phone');
      expect(mechanic).toHaveProperty('isActive');
      expect(mechanic).toHaveProperty('storeId');
      expect(mechanic).toHaveProperty('hiringDate');
    });

    it('when doing a insert a mechanic will receive same data send in the returning payload', async () => {
      const mechanic = await service.create(createMechanicDto);

      expect(mechanic.storeId).toBe(createMechanicDto.storeId);
      expect(mechanic.email).toBe(createMechanicDto.email);
      expect(mechanic.name).toBe(createMechanicDto.name);
      expect(mechanic.phone).toBe(createMechanicDto.phone);
      expect(mechanic.isActive).toBe(true);
      expect(mechanic.hiringDate).toBe(createMechanicDto.hiringDate);
    });

    it('when doing a insert a mechanic with same email it will return an conflict error', async () => {
      await service.create(createMechanicDto);
      try {
        await service.create(createMechanicDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.status).toBe(409);
        expect(e.message).toBe(emailInUse);
      }
    });

    it('when doing a insert a mechanic with invalid storeId should return an not found error', async () => {
      try {
        await service.create({ ...createMechanicDto, storeId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(storeNotFound);
      }
    });
  });

  describe('Update', () => {
    let insertMechanic: Mechanic;
    beforeEach(async () => {
      insertMechanic = await service.create(createMechanicDto);
    });

    it('should update a mechanic for the provided data', async () => {
      await service.update(insertMechanic.mechanicId, updateMechanicDto);
    });

    it('when doing a update with invalid mechanic id', async () => {
      try {
        await service.update('feb933a0-bb89-4d2d-a83d-a7ff83cd6334', updateMechanicDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Mechanic or Store Not Found');
      }
    });

    it('when doing a update with invalid store id', async () => {
      try {
        await service.update(insertMechanic.mechanicId, {
          ...updateMechanicDto,
          storeId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334'
        });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Mechanic or Store Not Found');
      }
    });
  });

  describe('Find', () => {
    let insertMechanic: Mechanic;
    beforeEach(async () => {
      insertMechanic = await service.create(createMechanicDto);
    });

    it('should find a mechanic with its mechanicId and be defined', async () => {
      const mechanic = await service.findOne(insertMechanic.mechanicId);
      expect(mechanic).toBeDefined();
    });

    it('should find a mechanic with its mechanicId and return its data', async () => {
      const mechanic = await service.findOne(insertMechanic.mechanicId);
      expect(mechanic.storeId).toBe(insertMechanic.storeId);
      expect(mechanic.mechanicId).toBe(insertMechanic.mechanicId);
      expect(mechanic.email).toBe(insertMechanic.email);
      expect(mechanic.name).toBe(insertMechanic.name);
      expect(mechanic.phone).toBe(insertMechanic.phone);
      expect(mechanic.isActive).toBe(insertMechanic.isActive);
      expect(mechanic.hiringDate).toBe(insertMechanic.hiringDate);
    });

    it('should find a mechanic with its mechanicId and not return the password', async () => {
      const mechanic = await service.findOne(insertMechanic.mechanicId);
      expect(mechanic).toBeDefined();
      expect(mechanic).not.toHaveProperty('password');
    });

    it('should generate an error if the passed mechanicId is not present in DB', async () => {
      try {
        await service.findOne('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(mechanicNotFound);
      }
    });
  });

  describe('Find All', () => {
    beforeEach(async () => {
      await service.create(createMechanicDto);
    });

    it('should find all mechanics', async () => {
      const mechanic = await service.findAll({});
      expect(mechanic).toBeDefined();
      expect(mechanic.items.length).toEqual(1);
    });

    it('should not find mechanics when searching by name Mack', async () => {
      const mechanic = await service.findAll({ name: 'Mack' });
      expect(mechanic).toBeDefined();
      expect(mechanic.items.length).toEqual(0);
    });

    it('should find mechanics when searching by name John', async () => {
      const mechanic = await service.findAll({ name: 'John' });
      expect(mechanic).toBeDefined();
      expect(mechanic.items.length).toEqual(1);
    });

    it('should find mechanics when searching by phone', async () => {
      const mechanic = await service.findAll({ phone: '866' });
      expect(mechanic).toBeDefined();
      expect(mechanic.items.length).toEqual(1);
    });
  });
});
