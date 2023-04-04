import IWhereFind from 'src/utils/typeorm/where.type';
import CreateClientDto from '../dto/create-client.dto';
import UpdateClientDto from '../dto/update-client.dto';
import Client from '../entities/client.entity';

export default interface IClientRepository {
  create(client: CreateClientDto): Promise<Client>;
  findOne(where: IWhereFind): Promise<Client>;
  update(id: string, clientPartial: UpdateClientDto): Promise<number>;
}
