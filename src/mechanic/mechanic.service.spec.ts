import { Test, TestingModule } from '@nestjs/testing';
import MechanicService from './mechanic.service';

describe('MechanicService', () => {
  let service: MechanicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MechanicService]
    }).compile();

    service = module.get<MechanicService>(MechanicService);
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
