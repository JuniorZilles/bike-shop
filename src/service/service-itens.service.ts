import { Injectable, NotFoundException } from '@nestjs/common';
import CreateServiceItensDto from './dto/create-service-itens.dto';
import UpdateServiceItensDto from './dto/update-service-itens.dto';
import ServiceItemRepository from './repository/implementation/ServiceItemRepository';
import PartRepository from '../part/repository/implementation/PartRepository';
import { partNotFound } from '../utils/constants/errorMessages';

@Injectable()
export default class ServiceItensService {
  constructor(
    private readonly partRepository: PartRepository,
    private readonly serviceItemRepository: ServiceItemRepository
  ) {}

  async create(id: string, createServiceItensDto: CreateServiceItensDto) {
    const { storeId, partId } = createServiceItensDto;
    const responseMechanic = await this.partRepository.findOne({ where: { storeId, partId } });
    if (!responseMechanic && !responseMechanic?.isActive) {
      throw new NotFoundException(partNotFound);
    }

    const part = await this.serviceItemRepository.create(id, createServiceItensDto);

    return part;
  }

  async update(id: string, itemId: string, updateServiceItensDto: UpdateServiceItensDto) {
    const response = await this.serviceItemRepository.update(id, itemId, updateServiceItensDto);
    if (!response || response === 0) {
      throw new NotFoundException('Service or Service Item Not Found');
    }
  }

  async remove(id: string, itemId: string) {
    const response = await this.serviceItemRepository.remove(id, itemId);
    if (!response || response === 0) {
      throw new NotFoundException('Service or Service Item Not Found');
    }
  }
}
