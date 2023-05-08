import { ILike, In, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import IServiceRepository from '../IServiceRepository';
import Service from '../../entities/service.entity';
import CreateServiceDto from '../../dto/create-service.dto';
import { ISearchServiceDTO } from '../../dto/search.dto';
import UpdateServiceDto from '../../dto/update-service.dto';

export default class ServiceRepository implements IServiceRepository {
  private repository: Repository<Service>;

  constructor(@InjectRepository(Service) repository: Repository<Service>) {
    this.repository = repository;
  }

  create(service: CreateServiceDto): Promise<Service> {
    const newService = this.repository.create(service);
    return this.repository.save(newService);
  }

  findOne(where: ISearchServiceDTO): Promise<Service> {
    return this.repository.findOne(where);
  }

  findAll(options: ISearchServiceDTO = { limit: 20, offset: 0 }): Promise<[Service[], number]> {
    const { where, offset: skip, limit: take } = options;
    const { storeIds, clientIds, mechanicIds, creationDate, ...rest } = where;

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

    if (mechanicIds) {
      newWhere.mechanicId = In<string>(mechanicIds.split(','));
    }

    if (creationDate) {
      newWhere.createdAt = MoreThanOrEqual(creationDate);
    }

    return this.repository.findAndCount({ skip, take, where: newWhere, relations: ['batch'] });
  }

  async update(id: string, payload: UpdateServiceDto): Promise<number> {
    const service = await this.repository.update({ serviceId: id }, payload);
    return service.affected;
  }

  async setIsActive(id: string, isActive: boolean): Promise<number> {
    const service = await this.repository.update(id, { isActive });
    return service.affected;
  }
}
