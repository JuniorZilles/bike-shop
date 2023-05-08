import { Test, TestingModule } from '@nestjs/testing';
import ServiceItensService from './service-itens.service';

describe('ServiceItensService', () => {
  let service: ServiceItensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceItensService]
    }).compile();

    service = module.get<ServiceItensService>(ServiceItensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have CRUD operations', () => {
    expect(service.create).toBeDefined();
    expect(service.remove).toBeDefined();
    expect(service.update).toBeDefined();
  });
});
