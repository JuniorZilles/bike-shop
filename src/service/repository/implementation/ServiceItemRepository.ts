import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import IServiceItemRepository from '../IServiceItemRepository';
import ServiceItem from '../../entities/serviceItem.entity';
import CreateServiceItemDto from '../../dto/create-service-itens.dto';
import UpdateServiceItemDto from '../../dto/update-service-itens.dto';

export default class ServiceItemRepository implements IServiceItemRepository {
  private repository: Repository<ServiceItem>;

  constructor(@InjectRepository(ServiceItem) repository: Repository<ServiceItem>) {
    this.repository = repository;
  }

  async remove(id: string, serviceId: string): Promise<number> {
    const item = await this.repository.delete({ serviceItemId: id, serviceId });
    return item.affected;
  }

  create(partId: string, item: CreateServiceItemDto): Promise<ServiceItem> {
    const newItem = this.repository.create({ ...item, partId });

    return this.repository.save(newItem);
  }

  async update(id: string, itemId: string, payload: UpdateServiceItemDto): Promise<number> {
    const item = await this.repository.update({ partId: id, serviceItemId: itemId }, payload);
    return item.affected;
  }
}
