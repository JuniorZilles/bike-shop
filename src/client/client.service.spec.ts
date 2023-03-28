import { randomUUID } from 'crypto';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ClientService from './client.service';
import Client from './entities/client.entity';
import { MockType } from '../utils/test/mocktype';
import ClientRepository from './repository/implementation/ClientRepository';
import CreateClientDto from './dto/create-client.dto';

describe('ClientService', () => {
  let service: ClientService;
  let clients: Client[] = [];
  const createClientDto: CreateClientDto = {
    email: 'john.doe@mail.com',
    password: 'strongPassword',
    name: 'John Doe',
    birthday: new Date('1994-11-14'),
    phone: '+55 12 94866-2978'
  };

  const clientRepositoryMock: () => MockType<Repository<Client>> = jest.fn(() => ({
    create: jest.fn((entity) => ({
      ...entity,
      id: randomUUID(),
      createdDate: new Date(),
      updatedDate: new Date(),
      isActive: true
    })),
    findOne: jest.fn(({ where }) => {
      const client = clients.find((item) => item.clientId === where.id || item.email === where.email);
      return client;
    }),
    find: jest.fn((entity) => entity),
    remove: jest.fn((entity) => entity),
    save: jest.fn((entity) => {
      const { password, ...rest } = entity;
      clients.push(rest);
      return rest;
    })
  }));

  beforeEach(async () => {
    clients = [];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Client),
          useFactory: clientRepositoryMock
        },
        ClientRepository,
        ClientService
      ]
    }).compile();

    service = module.get<ClientService>(ClientService);
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

  it('should insert a client for the provided data', async () => {
    const client = await service.create(createClientDto);
    expect(client).toBeDefined();
  });

  it('when doing a insert a client cannot receive its password', async () => {
    const client = await service.create(createClientDto);
    expect(client).toBeDefined();
    expect(client).not.toHaveProperty('password');
  });

  it('when doing a insert a client will receive a id in the returning payload', async () => {
    const client = await service.create(createClientDto);
    expect(client).toBeDefined();
    expect(client).toHaveProperty('id');
    expect(client).toHaveProperty('email');
    expect(client).toHaveProperty('name');
    expect(client).toHaveProperty('birthday');
    expect(client).toHaveProperty('phone');
    expect(client).toHaveProperty('isActive');
  });

  it('when doing a insert a client will receive same data send in the returning payload', async () => {
    const client = await service.create(createClientDto);

    expect(client.email).toBe(createClientDto.email);
    expect(client.name).toBe(createClientDto.name);
    expect(client.birthday).toBe(createClientDto.birthday);
    expect(client.phone).toBe(createClientDto.phone);
    expect(client.isActive).toBe(true);
  });

  it('when doing a insert a client with same email it will return an conflict error', async () => {
    await service.create(createClientDto);
    try {
      await service.create(createClientDto);
    } catch (e) {
      expect(e).toBeInstanceOf(ConflictException);
      expect(e.status).toBe(409);
      expect(e.message).toBe('Email already in use');
    }
  });
});
