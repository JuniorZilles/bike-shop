import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import CreateClientDto from './dto/create-client.dto';
import UpdateClientDto from './dto/update-client.dto';
import ClientRepository from './repository/implementation/ClientRepository';
import IQueryDTO from './dto/query.dto';
import { FindAllClient } from './dto/search.dto';

@Injectable()
export default class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(createClientDto: CreateClientDto) {
    const { email } = createClientDto;
    const response = await this.findByEmail(email);
    if (response?.isActive) {
      throw new ConflictException('Email already in use');
    }
    const client = await this.clientRepository.create({ ...createClientDto, isActive: true });

    return client;
  }

  private async findByEmail(email: string) {
    const response = await this.clientRepository.findOne({ where: { email } });
    return response;
  }

  async findAll(query?: IQueryDTO): Promise<FindAllClient> {
    const { limit, offset, ...where } = query;
    const response = await this.clientRepository.findAll({ limit, offset, where });
    return { totalResults: response[1], items: response[0], limit: query.limit || 20, offset: query.offset || 0 };
  }

  async findOne(clientId: string) {
    const response = await this.clientRepository.findOne({ where: { clientId } });
    if (!response) {
      throw new NotFoundException('Client Not Found');
    }
    return response;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const response = await this.clientRepository.update(id, updateClientDto);
    if (!response || response === 0) {
      throw new NotFoundException('Client Not Found');
    }
  }
}
