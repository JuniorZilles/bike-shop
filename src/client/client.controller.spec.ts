import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import ClientController from './client.controller';
import ClientService from './client.service';
import Client from './entities/client.entity';
import ClientRepository from './repository/implementation/ClientRepository';

describe('ClientController', () => {
  let controller: ClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: getRepositoryToken(Client),
          useFactory: jest.fn()
        },
        ClientRepository,
        ClientService
      ]
    }).compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have CRUD operations', () => {
    expect(controller.create).toBeDefined();
    expect(controller.findAll).toBeDefined();
    expect(controller.findOne).toBeDefined();
    expect(controller.remove).toBeDefined();
    expect(controller.update).toBeDefined();
  });
});
