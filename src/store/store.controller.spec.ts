import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import StoreController from './store.controller';
import StoreService from './store.service';
import StoreRepository from './repository/implementation/StoreRepository';
import Store from './entities/store.entity';

describe('StoreController', () => {
  let controller: StoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreController],
      providers: [
        {
          provide: getRepositoryToken(Store),
          useFactory: jest.fn()
        },
        StoreRepository,
        StoreService
      ]
    }).compile();

    controller = module.get<StoreController>(StoreController);
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
