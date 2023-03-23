import { Test, TestingModule } from '@nestjs/testing';
import { BikeService } from './bike.service';

describe('BikeService', () => {
  let service: BikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BikeService],
    }).compile();

    service = module.get<BikeService>(BikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
