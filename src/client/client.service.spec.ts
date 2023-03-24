import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';

describe('ClientService', () => {
  let service: ClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientService]
    }).compile();

    service = module.get<ClientService>(ClientService);
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

  it('should insert a client for the provided data', () => {});

  it('when doing a insert a client cannot receive its password', () => {});

  it('when doing a insert a client will receive a id in the returning payload', () => {});

  it('when doing a insert a client will receive same data send in the returning payload', () => {});

  it('when doing a insert a client with same email it will return an error', () => {});
});
