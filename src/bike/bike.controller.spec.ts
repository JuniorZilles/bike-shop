import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import Client from '../client/entities/client.entity';
import ClientRepository from '../client/repository/implementation/ClientRepository';
import BikeController from './bike.controller';
import BikeService from './bike.service';
import BikeRepository from './repository/implementation/BikeRepository';
import Bike from './entities/bike.entity';

describe('BikeController', () => {
  let controller: BikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BikeController],
      providers: [
        {
          provide: getRepositoryToken(Client),
          useFactory: jest.fn()
        },
        ClientRepository,
        {
          provide: getRepositoryToken(Bike),
          useFactory: jest.fn()
        },
        BikeRepository,
        BikeService
      ]
    }).compile();

    controller = module.get<BikeController>(BikeController);
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
