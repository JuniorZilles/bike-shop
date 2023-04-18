import { InjectRepository } from '@nestjs/typeorm';
import { FindOperator, ILike, Repository } from 'typeorm';
import { ISearchClientDTO } from '../../dto/search.dto';
import CreateClientDto from '../../dto/create-client.dto';
import Client from '../../entities/client.entity';
import IClientRepository from '../IClientRepository';
import UpdateClientDto from '../../dto/update-client.dto';

export default class ClientRepository implements IClientRepository {
  private repository: Repository<Client>;

  constructor(@InjectRepository(Client) repository: Repository<Client>) {
    this.repository = repository;
  }

  findAll(options: ISearchClientDTO = { limit: 20, offset: 0 }): Promise<[Client[], number]> {
    const { where, offset: skip, limit: take } = options;
    const { name, phone, ...rest } = where;
    const newWhere: { name?: FindOperator<string>; phone?: FindOperator<string>; isActive: boolean } = {
      isActive: true
    };
    if (name) {
      newWhere.name = ILike(`%${name}%`);
    }

    if (phone) {
      newWhere.phone = ILike(`%${phone}%`);
    }
    return this.repository.findAndCount({ skip, take, where: { ...rest, ...newWhere } });
  }

  async update(id: string, clientPartial: UpdateClientDto): Promise<number> {
    const client = await this.repository.update(id, clientPartial);
    return client.affected;
  }

  async create(client: CreateClientDto): Promise<Client> {
    const newClient = this.repository.create(client);
    return this.repository.save(newClient);
  }

  async findOne(where: ISearchClientDTO): Promise<Client> {
    return this.repository.findOne(where);
  }
}
