import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import ServiceItensService from './service-itens.service';
import Part from '../part/entities/part.entity';
import Service from './entities/service.entity';
import CreateServiceItensDto from './dto/create-service-itens.dto';
import UpdateServiceItensDto from './dto/update-service-itens.dto';
import ServiceItem from './entities/serviceItem.entity';
import { MockType } from '../utils/test/mocktype';
import ServiceItemRepository from './repository/implementation/ServiceItemRepository';
import PartRepository from '../part/repository/implementation/PartRepository';

describe('ServiceItensService', () => {
  let service: ServiceItensService;
  const partId1 = randomUUID();
  const partId2 = randomUUID();
  const storeId = randomUUID();
  const serviceId1 = randomUUID();

  const parts: Part[] = [
    {
      storeId,
      isActive: true,
      partId: partId1,
      manufacturer: 'Shimano',
      displayName: 'Par Freio MT 200',
      createdAt: new Date(),
      updatedAt: new Date(),
      batch: [
        {
          batchId: randomUUID(),
          partId: partId1,
          nf: '81486881713553303413365577369865103857553685108450',
          price: 400.99,
          qtd: 10,
          unit: 'pc',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    },
    {
      storeId,
      isActive: true,
      partId: partId2,
      manufacturer: 'Pneu',
      displayName: '29 2.1',
      createdAt: new Date(),
      updatedAt: new Date(),
      batch: [
        {
          batchId: randomUUID(),
          partId: partId2,
          nf: '81486881713553303413365575669865103857553685108450',
          price: 100.99,
          qtd: 10,
          unit: 'pc',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ];

  const services: Service[] = [
    {
      serviceId: serviceId1,
      bikeId: randomUUID(),
      clientId: randomUUID(),
      mechanicId: randomUUID(),
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

  const createServiceItemDto: CreateServiceItensDto = {
    partId: partId1,
    storeId,
    qtd: 1,
    unitPrice: 400.99
  };

  const updateServiceItemDto: UpdateServiceItensDto = {
    qtd: 2
  };

  const partRepositoryMock: () => MockType<Repository<Part>> = jest.fn(() => ({
    findOne: jest.fn(({ where }) => {
      const result = parts.find((item) => item.storeId === where.storeId && item.partId === where.partId);
      return result;
    })
  }));

  const serviceItemRepositoryMock: () => MockType<Repository<ServiceItem>> = jest.fn(() => ({
    create: jest.fn((entity) => ({
      ...entity,
      serviceItemId: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    })),
    delete: jest.fn((condition) => {
      const { serviceId, serviceItemId } = condition;
      const currentService = services.find((item) => item.serviceId === serviceId);
      const index = currentService?.itens?.findIndex((item) => item.serviceItemId === serviceItemId);
      if (index && index !== -1) {
        delete currentService.itens[index];
      }
      return { affected: index !== -1 ? 1 : 0 };
    }),
    save: jest.fn((entity) => {
      const index = services.findIndex((s) => s.serviceId === entity.serviceId);
      if (index !== -1) {
        services[index].itens.push(entity);
      }
      return entity;
    }),
    update: jest.fn((condition, entity) => {
      const { serviceId, serviceItemId } = condition;
      const currentService = services.find((item) => item.serviceId === serviceId);
      const index = currentService?.itens?.findIndex((item) => item.serviceItemId === serviceItemId);
      if (index && index !== -1) {
        currentService.itens[index] = { ...currentService.itens[index], ...entity };
      }
      return { affected: index !== -1 ? 1 : 0 };
    })
  }));

  beforeEach(async () => {
    services[0].itens = [];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Part),
          useFactory: partRepositoryMock
        },
        PartRepository,
        {
          provide: getRepositoryToken(ServiceItem),
          useFactory: serviceItemRepositoryMock
        },
        ServiceItemRepository,
        ServiceItensService
      ]
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

  describe('Insert', () => {
    it('should insert a serviceItem for the provided data', async () => {
      const result = await service.create(serviceId1, createServiceItemDto);
      expect(result).toBeDefined();
    });

    it('when doing a insert a serviceItem will receive a id in the returning payload', async () => {
      const result = await service.create(serviceId1, createServiceItemDto);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('partId');
      expect(result).toHaveProperty('serviceItemId');
      expect(result).toHaveProperty('qtd');
      expect(result).toHaveProperty('unitPrice');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('when doing a insert a serviceItem will receive same data send in the returning payload', async () => {
      const result = await service.create(serviceId1, createServiceItemDto);

      expect(result.partId).toBe(createServiceItemDto.partId);
      expect(result.serviceItemId).toBeDefined();
      expect(result.qtd).toBe(createServiceItemDto.qtd);
      expect(result.unitPrice).toBe(createServiceItemDto.unitPrice);
    });

    it('when doing a insert a serviceItem with invalid partId should return an not found error', async () => {
      try {
        await service.create(serviceId1, { ...createServiceItemDto, partId: 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Part Not Found');
      }
    });
  });

  describe('Update', () => {
    let serviceItemId: string;
    beforeEach(async () => {
      const result = await service.create(serviceId1, createServiceItemDto);
      serviceItemId = result.serviceItemId;
    });
    it('should update a serviceItem for the provided data', async () => {
      await service.update(serviceId1, serviceItemId, updateServiceItemDto);
    });

    it('when doing a update for a serviceItem with invalid serviceItemId should return an not found error', async () => {
      try {
        await service.update(serviceId1, 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334', updateServiceItemDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Service or Service Item Not Found');
      }
    });
  });

  describe('Remove', () => {
    let serviceItemId: string;
    beforeEach(async () => {
      const result = await service.create(serviceId1, createServiceItemDto);
      serviceItemId = result.serviceItemId;
    });
    it('should do a hard remove for the requested serviceItem', async () => {
      await service.remove(serviceId1, serviceItemId);
    });

    it('should generate an error if the passed serviceId is not present in DB', async () => {
      try {
        await service.remove('feb933a0-bb89-4d2d-a83d-a7ff83cd6334', serviceItemId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Service or Service Item Not Found');
      }
    });

    it('should generate an error if the passed serviceItemId is not present in DB', async () => {
      try {
        await service.remove(serviceId1, 'feb933a0-bb89-4d2d-a83d-a7ff83cd6334');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.status).toBe(404);
        expect(e.message).toBe('Service or Service Item Not Found');
      }
    });
  });
});
