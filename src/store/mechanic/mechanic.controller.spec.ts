import { Test, TestingModule } from '@nestjs/testing';
import { MechanicController } from './mechanic.controller';
import { MechanicService } from './mechanic.service';

describe('MechanicController', () => {
  let controller: MechanicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MechanicController],
      providers: [MechanicService],
    }).compile();

    controller = module.get<MechanicController>(MechanicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
