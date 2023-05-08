import CreateServiceItemDto from '../dto/create-service-itens.dto';
import UpdateServiceItemDto from '../dto/update-service-itens.dto';
import ServiceItem from '../entities/serviceItem.entity';

export default interface IServiceItemRepository {
  create(serviceId: string, item: CreateServiceItemDto): Promise<ServiceItem>;
  update(id: string, serviceId: string, item: UpdateServiceItemDto): Promise<number>;
  remove(id: string, serviceId: string): Promise<number>;
}
