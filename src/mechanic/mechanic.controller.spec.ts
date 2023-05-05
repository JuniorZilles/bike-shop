import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import MechanicController from './mechanic.controller';
import MechanicService from './mechanic.service';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import Store from '../store/entities/store.entity';
import MechanicRepository from './repository/implementation/MechanicRepository';
import Mechanic from './entities/mechanic.entity';

describe('MechanicController', () => {
  let controller: MechanicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MechanicController],
      providers: [
        {
          provide: getRepositoryToken(Store),
          useFactory: jest.fn()
        },
        StoreRepository,
        {
          provide: getRepositoryToken(Mechanic),
          useFactory: jest.fn()
        },
        MechanicRepository,
        MechanicService
      ]
    }).compile();

    controller = module.get<MechanicController>(MechanicController);
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
