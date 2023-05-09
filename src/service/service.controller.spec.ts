import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import ServiceController from './service.controller';
import ServiceService from './service.service';
import ServiceItensService from './service-itens.service';
import ServiceRepository from './repository/implementation/ServiceRepository';
import Service from './entities/service.entity';
import MechanicRepository from '../mechanic/repository/implementation/MechanicRepository';
import PartRepository from '../part/repository/implementation/PartRepository';
import BikeRepository from '../bike/repository/implementation/BikeRepository';
import ServiceItemRepository from './repository/implementation/ServiceItemRepository';
import Bike from '../bike/entities/bike.entity';
import Mechanic from '../mechanic/entities/mechanic.entity';
import Part from '../part/entities/part.entity';
import ServiceItem from './entities/serviceItem.entity';

describe('ServiceController', () => {
  let controller: ServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        {
          provide: getRepositoryToken(Mechanic),
          useFactory: jest.fn()
        },
        MechanicRepository,
        {
          provide: getRepositoryToken(Part),
          useFactory: jest.fn()
        },
        PartRepository,
        {
          provide: getRepositoryToken(Bike),
          useFactory: jest.fn()
        },
        BikeRepository,
        {
          provide: getRepositoryToken(ServiceItem),
          useFactory: jest.fn()
        },
        ServiceItemRepository,
        {
          provide: getRepositoryToken(Service),
          useFactory: jest.fn()
        },
        ServiceRepository,
        ServiceService,
        ServiceItensService
      ]
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
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
    expect(controller.createItem).toBeDefined();
    expect(controller.updateItem).toBeDefined();
    expect(controller.removeItem).toBeDefined();
  });
});
