import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import BikeService from './bike.service';
import { MockType } from '../utils/test/mocktype';
import Client from '../client/entities/client.entity';
import ClientRepository from '../client/repository/implementation/ClientRepository';
import Bike from './entities/bike.entity';
import CreateBikeDto from './dto/create-bike.dto';
import BikeRepository from './repository/implementation/BikeRepository';
import UpdateBikeDto from './dto/update-bike.dto';
import { bikeNotFound, userNotFound } from '../utils/constants/errorMessages';

describe('BikeService', () => {
  let service: BikeService;
  let bikes: Bike[] = [];
  const generatedClientId = randomUUID();
  const clients: Client[] = [
    {
      email: 'john.doe@mail.com',
      password: 'strongPassword',
      name: 'John Doe',
      birthday: new Date('1994-11-14'),
      phone: '+55 12 94866-2978',
      clientId: generatedClientId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }
  ];

  const createBikeDto: CreateBikeDto = {
    displayName: 'HDS 2021',
    brand: 'OGGI',
    clientId: generatedClientId,
    color: 'Red',
    nr: '12456798',
    rimSize: 29
  };

  const updateBikeDto: UpdateBikeDto = {
    displayName: 'HDS 2022',
    brand: 'OGGI',
    clientId: generatedClientId,
    color: 'Red',
    nr: '129872798',
    rimSize: 29
  };

  const clientRepositoryMock: () => MockType<Repository<Client>> = jest.fn(() => ({
    findOne: jest.fn(({ where }) => {
      const client = clients.find((item) => item.clientId === where.clientId);
      return client;
    })
  }));

  const bikeRepositoryMock: () => MockType<Repository<Bike>> = jest.fn(() => ({
    create: jest.fn((entity) => ({
      ...entity,
      bikeId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    })),
    findOne: jest.fn(({ where }) => {
      const bike = bikes.find((item) => item.bikeId === where.bikeId);
      return bike;
    }),
    findAndCount: jest.fn(({ where }) => {
      const keys = Object.keys(where);
      if (keys.length > 1) {
        const bike = bikes.filter(
          (item) =>
            item.isActive === where.isActive &&
            (item.brand.includes(where.brand?.value?.replace(/%/g, '')) ||
              item.color.includes(where.color?.value?.replace(/%/g, '')) ||
              item.clientId.includes(where.clientId?.value?.replace(/%/g, '')) ||
              item.displayName.includes(where.displayName?.value?.replace(/%/g, '')))
        );
        return [bike, bike.length];
      }
      return [bikes, bikes.length];
    }),
    find: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
    save: jest.fn((entity) => {
      bikes.push(entity);
      return entity;
    }),
    update: jest.fn((condition, entity) => {
      let index = -1;
      const { bikeId, clientId } = condition;
      if (bikeId && clientId) {
        index = bikes.findIndex((item) => item.bikeId === bikeId && item.clientId === clientId);
      } else {
        index = bikes.findIndex((item) => item.bikeId === condition);
      }
      if (index >= 0) {
        bikes[index] = { ...bikes[index], ...entity };
      }
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
    bikes = [];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Client),
          useFactory: clientRepositoryMock
        },
        ClientRepository,
        {
          provide: getRepositoryToken(Bike),
          useFactory: bikeRepositoryMock
        },
        BikeRepository,
        BikeService
      ]
    }).compile();

    service = module.get<BikeService>(BikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have CRUD operations', () => {
    expect(service.create).toBeDefined();
    expect(service.findAll).toBeDefined();
    expect(service.findOne).toBeDefined();
    expect(service.update).toBeDefined();
    expect(service.remove).toBeDefined();
  });

  describe('Insert', () => {
    it('should insert a bike for the provided data', async () => {
      const bike = await service.create(createBikeDto);
      expect(bike).toBeDefined();
    });

    it('when doing a insert of a bike cannot pass a invalid user', async () => {
      try {
        await service.create({ ...createBikeDto, clientId: randomUUID() });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(userNotFound);
      }
    });

    it('when doing a insert a bike will receive a id in the returning payload', async () => {
      const bike = await service.create(createBikeDto);
      expect(bike).toBeDefined();
      expect(bike).toHaveProperty('bikeId');
    });

    it('when doing a insert a bike will receive same data send in the returning payload', async () => {
      const bike = await service.create(createBikeDto);

      expect(bike.brand).toBe(createBikeDto.brand);
      expect(bike.clientId).toBe(createBikeDto.clientId);
      expect(bike.color).toBe(createBikeDto.color);
      expect(bike.displayName).toBe(createBikeDto.displayName);
      expect(bike.nr).toBe(createBikeDto.nr);
      expect(bike.rimSize).toBe(createBikeDto.rimSize);
      expect(bike.isActive).toBe(true);
    });
  });

  describe('Update', () => {
    it('should update a bike for the provided data', async () => {
      const insertedBike = await service.create(createBikeDto);
      await service.update(insertedBike.bikeId, updateBikeDto);
    });

    it('should generate an error if the passed bikeId is not present in DB', async () => {
      try {
        await service.update('feb933a0-bb89-4d2d-a83d-a7ff83cd6334', updateBikeDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Bike or User Not Found');
      }
    });

    it('should generate an error if the passed clientId is not related to the updated bike in DB', async () => {
      const insertedBike = await service.create(createBikeDto);
      try {
        await service.update(insertedBike.bikeId, {
          ...updateBikeDto,
          clientId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334'
        });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Bike or User Not Found');
      }
    });
  });

  describe('Find by Id', () => {
    let insertedBike: Bike;
    beforeEach(async () => {
      insertedBike = await service.create(createBikeDto);
    });

    it('should find a bike with its bikeId and be defined', async () => {
      const bike = await service.findOne(insertedBike.bikeId);
      expect(bike).toBeDefined();
    });

    it('should find a bike with its bikeId and return its data', async () => {
      const bike = await service.findOne(insertedBike.bikeId);
      expect(bike.clientId).toBe(insertedBike.clientId);
      expect(bike.bikeId).toBe(insertedBike.bikeId);
      expect(bike.brand).toBe(insertedBike.brand);
      expect(bike.color).toBe(insertedBike.color);
      expect(bike.displayName).toBe(insertedBike.displayName);
      expect(bike.isActive).toBe(insertedBike.isActive);
      expect(bike.rimSize).toBe(insertedBike.rimSize);
      expect(bike.nr).toBe(insertedBike.nr);
    });

    it('should generate an error if the passed bikeId is not present in DB', async () => {
      try {
        await service.findOne('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(bikeNotFound);
      }
    });
  });

  describe('Find all', () => {
    beforeEach(async () => {
      await service.create(createBikeDto);
    });

    it('should find all bikes', async () => {
      const bike = await service.findAll({});
      expect(bike).toBeDefined();
      expect(bike.items.length).toEqual(1);
    });

    it('should find bikes when searching by displayName HDS', async () => {
      const bike = await service.findAll({ displayName: 'HDS' });
      expect(bike).toBeDefined();
      expect(bike.items.length).toEqual(1);
    });

    it(`should find bikes when searching by clientId ${generatedClientId}`, async () => {
      const bike = await service.findAll({ clientId: generatedClientId });
      expect(bike).toBeDefined();
      expect(bike.items.length).toEqual(1);
    });

    it('should find bikes when searching by brand', async () => {
      const bike = await service.findAll({ brand: 'OGGI' });
      expect(bike).toBeDefined();
      expect(bike.items.length).toEqual(1);
    });

    it('should not find bikes when searching by brand that isnt registered', async () => {
      const bike = await service.findAll({ brand: 'GTS' });
      expect(bike).toBeDefined();
      expect(bike.items.length).toEqual(0);
    });
  });

  describe('Remove', () => {
    it('should do a soft remove for the requested bike', async () => {
      const insertedBike = await service.create(createBikeDto);
      await service.remove(insertedBike.bikeId);
    });

    it('should generate an error if the passed bikeId is not present in DB', async () => {
      try {
        await service.remove('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(bikeNotFound);
      }
    });
  });
});
