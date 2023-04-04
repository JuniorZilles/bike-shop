import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IWhereFind from '../../../utils/typeorm/where.type';
import CreateClientDto from '../../dto/create-client.dto';
import Client from '../../entities/client.entity';
import IClientRepository from '../IClientRepository';
import UpdateClientDto from '../../dto/update-client.dto';

export default class ClientRepository implements IClientRepository {
  private repository: Repository<Client>;

  constructor(@InjectRepository(Client) repository: Repository<Client>) {
    this.repository = repository;
  }

  async update(id: string, clientPartial: UpdateClientDto): Promise<Client> {
    const client = await this.repository.update(id, clientPartial);
    return client.raw;
  }

  async create(client: CreateClientDto): Promise<Client> {
    const newClient = this.repository.create(client);
    return this.repository.save(newClient);
  }

  async findOne(where: IWhereFind): Promise<Client> {
    return this.repository.findOne(where);
  }
}
