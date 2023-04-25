import { ISearchClientDTO } from '../dto/search.dto';
import CreateClientDto from '../dto/create-client.dto';
import UpdateClientDto from '../dto/update-client.dto';
import Client from '../entities/client.entity';

export default interface IClientRepository {
  create(client: CreateClientDto): Promise<Client>;
  findOne(where: ISearchClientDTO): Promise<Client>;
  findAll(options: ISearchClientDTO): Promise<[Client[], number]>;
  update(id: string, clientPartial: UpdateClientDto): Promise<number>;
}
