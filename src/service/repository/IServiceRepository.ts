import CreateServiceDto from '../dto/create-service.dto';
import IQueryFind from '../dto/query-find.dto';
import { ISearchServiceDTO } from '../dto/search.dto';
import UpdateServiceDto from '../dto/update-service.dto';
import Service from '../entities/service.entity';

export default interface IServiceRepository {
  create(Service: CreateServiceDto): Promise<Service>;
  findOne(where: IQueryFind): Promise<Service>;
  findAll(options: ISearchServiceDTO): Promise<[Service[], number]>;
  update(id: string, ServiceServiceial: UpdateServiceDto): Promise<number>;
}
