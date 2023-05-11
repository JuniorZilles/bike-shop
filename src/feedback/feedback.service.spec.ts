import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import FeedbackService from './feedback.service';
import FeedbackRepository from './repository/implementation/FeedbackRepository';
import Feedback from './entities/feedback.entity';
import Service from '../service/entities/service.entity';
import ServiceRepository from '../service/repository/implementation/ServiceRepository';
import CreateFeedbackDto from './dto/create-feedback.dto';
import UpdateFeedbackDto from './dto/update-feedback.dto';
import { MockType } from '../utils/test/mocktype';
import { feedbackNotFound, serviceNotFound } from '../utils/constants/errorMessages';

describe('FeedbackService', () => {
  let service: FeedbackService;
  const storeId = randomUUID();
  const serviceId = randomUUID();
  const clientId = randomUUID();
  const mechanicId = randomUUID();
  let feedbacks: Feedback[] = [];
  const services: Service[] = [
    {
      serviceId,
      bikeId: randomUUID(),
      clientId,
      mechanicId,
      storeId,
      description: 'Troca de pneu',
      additionalItens: [
        {
          description: 'Mão de obra',
          value: 10
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      itens: []
    }
  ];

  const createFeedbackDto: CreateFeedbackDto = {
    serviceId,
    description: 'Serviço muito mal feito, nunca mais',
    rating: 1
  };

  const updateFeedbackDto: UpdateFeedbackDto = {
    rating: 4
  };

  const serviceRepositoryMock: () => MockType<Repository<Service>> = jest.fn(() => ({
    findOne: jest.fn(({ where }) => {
      const result = services.find((item) => item.serviceId === where.serviceId);
      return result;
    }),
    findAndCount: jest.fn(({ where }) => {
      const keys = Object.keys(where);
      if (keys.length > 1) {
        const result = services.filter(
          (item) =>
            item.isActive === where.isActive &&
            (where.mechanicId?.value?.includes(item.mechanicId) ||
              where.clientId?.value?.includes(item.clientId) ||
              where.storeId?.value?.includes(item.storeId) ||
              where.bikeId?.value?.includes(item.bikeId))
        );
        return [result, result.length];
      }
      return [services, services.length];
    })
  }));

  const feedbackRepositoryMock: () => MockType<Repository<Feedback>> = jest.fn(() => ({
    create: jest.fn((entity) => ({
      ...entity,
      feedbackId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    save: jest.fn((entity) => {
      feedbacks.push(entity);
      return entity;
    }),
    findOne: jest.fn(({ where }) => {
      const result = feedbacks.find((item) => item.feedbackId === where.feedbackId);
      return result;
    }),
    findAndCount: jest.fn(({ where }) => {
      const keys = Object.keys(where);
      if (keys.length >= 1) {
        const result = feedbacks.filter(
          (item) =>
            where.rating === item.rating ||
            item.serviceId === where.serviceId?.value ||
            where.serviceId?.value?.includes(item.serviceId)
        );
        return [result, result.length];
      }
      return [feedbacks, feedbacks.length];
    }),
    update: jest.fn((condition, entity) => {
      const index = feedbacks.findIndex((item) => item.feedbackId === condition);
      feedbacks[index] = { ...feedbacks[index], ...entity };
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
    feedbacks = [];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceRepository,
        {
          provide: getRepositoryToken(Service),
          useFactory: serviceRepositoryMock
        },
        FeedbackRepository,
        {
          provide: getRepositoryToken(Feedback),
          useFactory: feedbackRepositoryMock
        },
        FeedbackService
      ]
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have CRUD operations', () => {
    expect(service.create).toBeDefined();
    expect(service.findAll).toBeDefined();
    expect(service.findOne).toBeDefined();
    expect(service.update).toBeDefined();
  });

  describe('Insert', () => {
    it('should insert a feedback for the provided data', async () => {
      const result = await service.create(createFeedbackDto);
      expect(result).toBeDefined();
    });

    it('when doing a insert a feedback will receive a id in the returning payload', async () => {
      const result = await service.create(createFeedbackDto);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('serviceId');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('feedbackId');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('when doing a insert a feedback will receive same data send in the returning payload', async () => {
      const result = await service.create(createFeedbackDto);

      expect(result.description).toBe(createFeedbackDto.description);
      expect(result.rating).toBe(createFeedbackDto.rating);
      expect(result.feedbackId).toBeDefined();
      expect(result.serviceId).toBe(createFeedbackDto.serviceId);
    });

    it('when doing a insert a feedback with invalid serviceId should return an not found error', async () => {
      try {
        await service.create({ ...createFeedbackDto, serviceId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(serviceNotFound);
      }
    });
  });

  describe('Update', () => {
    let feedbackId: string;
    beforeEach(async () => {
      const result = await service.create(createFeedbackDto);
      feedbackId = result.feedbackId;
    });
    it('should update a feedback for the provided data', async () => {
      await service.update(feedbackId, updateFeedbackDto);
    });

    it('when doing a update for a feedback with invalid feedbackId should return an not found error', async () => {
      try {
        await service.update('feb933a0-bb89-4d2d-a83d-a7ff83cd6334', updateFeedbackDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(feedbackNotFound);
      }
    });
  });

  describe('Find By Id', () => {
    let feedbackObj: Feedback;
    beforeEach(async () => {
      feedbackObj = await service.create(createFeedbackDto);
    });

    it('when searching for a feedback should return the provided data', async () => {
      const result = await service.findOne(feedbackObj.feedbackId);
      expect(result).toHaveProperty('serviceId');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('rating');
      expect(result).toHaveProperty('feedbackId');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('when searching for a feedback should return same data received from create', async () => {
      const result = await service.findOne(feedbackObj.feedbackId);
      expect(result.description).toBe(feedbackObj.description);
      expect(result.rating).toBe(feedbackObj.rating);
      expect(result.feedbackId).toBe(feedbackObj.feedbackId);
      expect(result.serviceId).toBe(feedbackObj.serviceId);
    });

    it('when searching for a feedback with invalid feedbackId should return an not found error', async () => {
      try {
        await service.findOne('feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe(feedbackNotFound);
      }
    });
  });

  describe('Find all', () => {
    beforeEach(async () => {
      await service.create(createFeedbackDto);
    });

    it('should find all feedbacks', async () => {
      const result = await service.findAll({});
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it(`should find feedbacks when searching by mechanic ${mechanicId}`, async () => {
      const result = await service.findAll({ mechanicId });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it(`should find feedbacks when searching by storeId ${storeId}`, async () => {
      const result = await service.findAll({ storeId });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it(`should find feedbacks when searching by clientId ${clientId}`, async () => {
      const result = await service.findAll({ clientId });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it('should find feedbacks when searching by rating 1', async () => {
      const result = await service.findAll({ rating: 1 });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(1);
    });

    it('should not find feedbacks when searching by clientId that isnt registered', async () => {
      const result = await service.findAll({ clientId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      expect(result).toBeDefined();
      expect(result.items.length).toEqual(0);
    });
  });
});
