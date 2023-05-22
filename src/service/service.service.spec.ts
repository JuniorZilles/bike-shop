import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import ServiceService from './service.service';
import PartRepository from '../part/repository/implementation/PartRepository';
import BikeRepository from '../bike/repository/implementation/BikeRepository';
import ServiceRepository from './repository/implementation/ServiceRepository';
import Service from './entities/service.entity';
import Bike from '../bike/entities/bike.entity';
import Part from '../part/entities/part.entity';
import { MockType } from '../utils/test/mocktype';
import CreateServiceDto from './dto/create-service.dto';
import UpdateServiceDto from './dto/update-service.dto';
import MechanicRepository from '../mechanic/repository/implementation/MechanicRepository';
import Mechanic from '../mechanic/entities/mechanic.entity';
import { mechanicNotFound, serviceNotFound } from '../utils/constants/errorMessages';

describe('ServiceService', () => {
  let service: ServiceService;
  const partId = randomUUID();
  const storeId = randomUUID();
  const clientId = randomUUID();
  const bikeId = randomUUID();
  const mechanicId = randomUUID();
  const parts: Part[] = [
    {
      storeId,
      isActive: true,
      partId,
      manufacturer: 'Shimano',
      displayName: 'Par Freio MT 200',
      createdAt: new Date(),
      updatedAt: new Date(),
      batch: [
        {
          batchId: randomUUID(),
          partId,
          nf: '81486881713553303413365577369865103857553685108450',
          price: 15.99,
          qtd: 10,
          unit: 'pc',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ];
  const mechanics: Mechanic[] = [
    {
      mechanicId,
      email: 'john.doe@mail.com',
      hiringDate: new Date('2022-11-14'),
      name: 'John Doe',
      password: 'aksjdkasjmd65asd654',
      phone: '+55 12 94866-2978',
      storeId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  const bikes: Bike[] = [
    {
      bikeId,
      displayName: 'HDS 2021',
      brand: 'OGGI',
      clientId,
      color: 'Red',
      nr: '12456798',
      rimSize: 29,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  let services: Service[] = [];

  const createServiceDto: CreateServiceDto = {
    bikeId,
    clientId,
    mechanicId,
    storeId,
    description: 'Troca de pneu',
    additionalItens: [
      {
        description: 'Mão de obra',
        value: 10
      }
    ]
  };

  const updateServiceDto: UpdateServiceDto = {
    description: 'Troca de câmara'
  };

  const mechanicRepositoryMock: () => MockType<Repository<Part>> = jest.fn(() => ({
    findOne: jest.fn(({ where }) => {
      const result = mechanics.find((item) => item.storeId === where.storeId && item.mechanicId === where.mechanicId);
      return result;
    })
  }));

  const partRepositoryMock: () => MockType<Repository<Part>> = jest.fn(() => ({
    findOne: jest.fn(({ where }) => {
      const result = parts.find((item) => item.storeId === where.storeId && item.partId === where.partId);
      return result;
    })
  }));

  const bikeRepositoryMock: () => MockType<Repository<Part>> = jest.fn(() => ({
    findOne: jest.fn(({ where }) => {
      const result = bikes.find((item) => item.bikeId === where.bikeId && item.clientId === where.clientId);
      return result;
    })
  }));

  const serviceRepositoryMock: () => MockType<Repository<Service>> = jest.fn(() => ({
    create: jest.fn((entity) => ({
      ...entity,
      serviceId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    })),
    findOne: jest.fn(({ where }) => {
      const result = services.find((item) => item.serviceId === where.serviceId);
      return result;
    }),
    findAndCount: jest.fn(({ where }) => {
      const keys = Object.keys(where);
      if (keys.length > 1) {
        const result = services.filter(
          (item) =>
            item.isActive === where.isActive &&
            (where.mechanicId?.value?.includes(item.mechanicId) ||
              where.clientId?.value?.includes(item.clientId) ||
              where.storeId?.value?.includes(item.storeId) ||
              where.bikeId?.value?.includes(item.bikeId))
        );
        return [result, result.length];
      }
      return [services, services.length];
    }),
    find: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
    save: jest.fn((entity) => {
      services.push(entity);
      return entity;
    }),
    update: jest.fn((condition, entity) => {
      const index = services.findIndex((item) => item.serviceId === condition);
      if (index >= 0) {
        services[index] = { ...services[index], ...entity };
      }
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
    services = [];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Part),
          useFactory: partRepositoryMock
        },
        PartRepository,
        {
          provide: getRepositoryToken(Mechanic),
          useFactory: mechanicRepositoryMock
        },
        MechanicRepository,
        {
          provide: getRepositoryToken(Bike),
          useFactory: bikeRepositoryMock
        },
        BikeRepository,
        {
          provide: getRepositoryToken(Service),
          useFactory: serviceRepositoryMock
        },
        ServiceRepository,
        ServiceService
      ]
    }).compile();

    service = module.get<ServiceService>(ServiceService);
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
    it('should insert a service for the provided data', async () => {
      const result = await service.create(createServiceDto);
      expect(result).toBeDefined();
    });

    it('when doing a insert a service will receive a id in the returning payload', async () => {
      const result = await service.create(createServiceDto);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('serviceId');
      expect(result).toHaveProperty('storeId');
      expect(result).toHaveProperty('mechanicId');
      expect(result).toHaveProperty('clientId');
      expect(result).toHaveProperty('bikeId');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result).toHaveProperty('isActive');
      expect(result).toHaveProperty('additionalItens');
    });

    it('when doing a insert a service will receive same data send in the returning payload', async () => {
      const result = await service.create(createServiceDto);

      expect(result.storeId).toBe(createServiceDto.storeId);
      expect(result.additionalItens).toBe(createServiceDto.additionalItens);
      expect(result.serviceId).toBeDefined();
      expect(result.bikeId).toBe(createServiceDto.bikeId);
      expect(result.mechanicId).toBe(createServiceDto.mechanicId);
      expect(result.clientId).toBe(createServiceDto.clientId);
      expect(result.description).toBe(createServiceDto.description);
      expect(result.isActive).toBe(true);
    });

    it('when doing a insert a service with invalid storeId should return an not found error', async () => {
      try {
        await service.create({ ...createServiceDto, storeId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Store or Mechanic Not Found');
      }
    });

    it('when doing a insert a service with invalid mechanicId should return an not found error', async () => {
      try {
        await service.create({ ...createServiceDto, mechanicId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Store or Mechanic Not Found');
      }
    });

    it('when doing a insert a service with invalid bikeId should return an not found error', async () => {
      try {
        await service.create({ ...createServiceDto, bikeId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Client or Bike Not Found');
      }
    });

    it('when doing a insert a service with invalid clientId should return an not found error', async () => {
      try {
        await service.create({ ...createServiceDto, clientId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Client or Bike Not Found');
      }
    });
  });

  describe('Update', () => {
    let serviceId: string;
    beforeEach(async () => {
      const result = await service.create(createServiceDto);
      serviceId = result.serviceId;
    });
    it('should update a service for the provided data', async () => {
      await service.update(serviceId, updateServiceDto);
    });

    it('when doing a update for a service with invalid serviceId should return an not found error', async () => {
      try {
        await service.update('feb933a0-bb89-4d2d-a83d-a7ff83cd6334', updateServiceDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(serviceNotFound);
      }
    });

    it('when doing a update for a service with invalid mechanicId should return an not found error', async () => {
      try {
        await service.update(serviceId, { ...updateServiceDto, mechanicId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(mechanicNotFound);
      }
    });
  });

  describe('Find By Id', () => {
    let serviceObj: Service;
    beforeEach(async () => {
      serviceObj = await service.create(createServiceDto);
    });

    it('when searching for a service should return the provided data', async () => {
      const result = await service.findOne(serviceObj.serviceId);
      expect(result).toHaveProperty('serviceId');
      expect(result).toHaveProperty('storeId');
      expect(result).toHaveProperty('mechanicId');
      expect(result).toHaveProperty('clientId');
      expect(result).toHaveProperty('bikeId');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
      expect(result).toHaveProperty('isActive');
      expect(result).toHaveProperty('additionalItens');
    });

    it('when searching for a service should return same data received from create', async () => {
      const result = await service.findOne(serviceObj.serviceId);
      expect(result.storeId).toBe(serviceObj.storeId);
      expect(result.serviceId).toBe(serviceObj.serviceId);
      expect(result.additionalItens).toBe(serviceObj.additionalItens);
      expect(result.bikeId).toBe(serviceObj.bikeId);
      expect(result.mechanicId).toBe(serviceObj.mechanicId);
      expect(result.clientId).toBe(serviceObj.clientId);
      expect(result.description).toBe(serviceObj.description);
      expect(result.isActive).toBe(serviceObj.isActive);
    });

    it('when searching for a service with invalid serviceId should return an not found error', async () => {
      try {
        await service.findOne('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(serviceNotFound);
      }
    });
  });

  describe('Find all', () => {
    beforeEach(async () => {
      await service.create(createServiceDto);
    });

    it('should find all services', async () => {
      const result = await service.findAll({});
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it(`should find services when searching by mechanic ${mechanicId}`, async () => {
      const result = await service.findAll({ mechanicIds: mechanicId });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it(`should find services when searching by storeId ${storeId}`, async () => {
      const result = await service.findAll({ storeIds: storeId });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it(`should find services when searching by clientId ${clientId}`, async () => {
      const result = await service.findAll({ clientIds: clientId });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it(`should find services when searching by bikeId ${bikeId}`, async () => {
      const result = await service.findAll({ bikeIds: bikeId });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it('should not find services when searching by clientId that isnt registered', async () => {
      const result = await service.findAll({ clientIds: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(0);
    });
  });

  describe('Remove', () => {
    it('should do a soft remove for the requested service', async () => {
      const result = await service.create(createServiceDto);
      await service.remove(result.serviceId);
    });

    it('should generate an error if the passed serviceId is not present in DB', async () => {
      try {
        await service.remove('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(serviceNotFound);
      }
    });
  });
});
