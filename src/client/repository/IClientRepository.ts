import IWhereFind from 'src/utils/typeorm/where.type';
import CreateClientDto from '../dto/create-client.dto';

export default interface IClientRepository {
  create(client: CreateClientDto);
  findOne(where: IWhereFind);
}
