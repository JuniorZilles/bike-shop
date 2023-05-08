import { Test, TestingModule } from '@nestjs/testing';
import ServiceController from './service.controller';
import ServiceService from './service.service';
import ServiceItensService from './service-itens.service';

describe('ServiceController', () => {
  let controller: ServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [ServiceService, ServiceItensService]
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
