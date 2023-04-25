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

describe('BikeService', () => {
  let service: BikeService;
  let bikes: Bike[] = [];
  const clientId = randomUUID();
  const clients: Client[] = [
    {
      email: 'john.doe@mail.com',
      password: 'strongPassword',
      name: 'John Doe',
      birthday: new Date('1994-11-14'),
      phone: '+55 12 94866-2978',
      clientId,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }
  ];

  const createBikeDto: CreateBikeDto = {
    displayName: 'HDS 2021',
    brand: 'Oggi',
    clientId,
    color: 'Red',
    nr: '12456798',
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
      if (Object.keys(where).length > 1) {
        const client = bikes.filter((item) => item.isActive === where.isActive);
        return [client, client.length];
      }
      return [bikes, bikes.length];
    }),
    find: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
    save: jest.fn((entity) => {
      bikes.push(entity);
      return entity;
    }),
    update: jest.fn((id, entity) => {
      const index = bikes.findIndex((item) => item.bikeId === id);
      bikes[index] = { ...bikes[index], ...entity };
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
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
    expect(service.remove).toBeDefined();
    expect(service.update).toBeDefined();
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
        expect(e.message).toBe('User not found');
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
});
