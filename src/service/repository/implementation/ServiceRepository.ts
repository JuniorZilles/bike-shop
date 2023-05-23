import { ILike, In, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import IServiceRepository from '../IServiceRepository';
import Service from '../../entities/service.entity';
import CreateServiceDto from '../../dto/create-service.dto';
import { ISearchServiceDTO } from '../../dto/search.dto';
import UpdateServiceDto from '../../dto/update-service.dto';
import IQueryFind from '../../dto/query-find.dto';

export default class ServiceRepository implements IServiceRepository {
  private repository: Repository<Service>;

  constructor(@InjectRepository(Service) repository: Repository<Service>) {
    this.repository = repository;
  }

  create(service: CreateServiceDto): Promise<Service> {
    const newService = this.repository.create(service);
    return this.repository.save(newService);
  }

  findOne(where: IQueryFind): Promise<Service> {
    return this.repository.findOne({ where, relations: ['itens'] });
  }

  findAll(options: ISearchServiceDTO = { limit: 20, offset: 0 }): Promise<[Service[], number]> {
    const { where, offset: skip, limit: take } = options;
    const { storeIds, clientIds, mechanicIds, bikeIds, creationDate, isActive, ...rest } = where;

    const newWhere: { [name: string]: unknown } = { isActive: true };

    Object.keys(rest).forEach((key) => {
      newWhere[key] = ILike(`%${rest[key]}%`);
    });

    if (storeIds) {
      newWhere.storeId = In<string>(storeIds.split(','));
    }

    if (clientIds) {
      newWhere.clientId = In<string>(clientIds.split(','));
    }

    if (bikeIds) {
      newWhere.bikeId = In<string>(bikeIds.split(','));
    }

    if (mechanicIds) {
      newWhere.mechanicId = In<string>(mechanicIds.split(','));
    }

    if (creationDate) {
      newWhere.createdAt = MoreThanOrEqual(creationDate);
    }

    if (isActive) {
      newWhere.isActive = isActive === 'true';
    }

    return this.repository.findAndCount({ skip, take, where: newWhere, relations: ['itens'] });
  }

  async update(id: string, payload: UpdateServiceDto): Promise<number> {
    const service = await this.repository.update(id, payload);
    return service.affected;
  }

  async setIsActive(id: string, isActive: boolean): Promise<number> {
    const service = await this.repository.update(id, { isActive });
    return service.affected;
  }
}
