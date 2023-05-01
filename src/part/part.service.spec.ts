import { Test, TestingModule } from '@nestjs/testing';
import { PartService } from './part.service';

describe('PartService', () => {
  let service: PartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartService]
    }).compile();

    service = module.get<PartService>(PartService);
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
});
