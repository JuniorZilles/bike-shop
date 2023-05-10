import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import FeedbackController from './feedback.controller';
import FeedbackService from './feedback.service';
import FeedbackRepository from './repository/implementation/FeedbackRepository';
import Feedback from './entities/feedback.entity';
import Service from '../service/entities/service.entity';
import ServiceRepository from '../service/repository/implementation/ServiceRepository';

describe('FeedbackController', () => {
  let controller: FeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: getRepositoryToken(Service),
          useFactory: jest.fn()
        },
        ServiceRepository,
        {
          provide: getRepositoryToken(Feedback),
          useFactory: jest.fn()
        },
        FeedbackRepository,
        FeedbackService
      ]
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have CRUD operations', () => {
    expect(controller.create).toBeDefined();
    expect(controller.findAll).toBeDefined();
    expect(controller.findOne).toBeDefined();
    expect(controller.update).toBeDefined();
  });
});
