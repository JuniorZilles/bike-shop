import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import PartController from './part.controller';
import PartService from './part.service';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import PartRepository from './repository/implementation/PartRepository';
import Part from './entities/part.entity';
import Store from '../store/entities/store.entity';

describe('PartController', () => {
  let controller: PartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartController],
      providers: [
        {
          provide: getRepositoryToken(Store),
          useFactory: jest.fn()
        },
        StoreRepository,
        {
          provide: getRepositoryToken(Part),
          useFactory: jest.fn()
        },
        PartRepository,
        PartService
      ]
    }).compile();

    controller = module.get<PartController>(PartController);
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
    expect(controller.updateBatch).toBeDefined();
    expect(controller.createBatch).toBeDefined();
  });
});
