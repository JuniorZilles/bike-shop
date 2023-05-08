import { Injectable } from '@nestjs/common';
import CreateServiceItensDto from './dto/create-service-itens.dto';
import UpdateServiceItensDto from './dto/update-service-itens.dto';

@Injectable()
export default class ServiceItensService {
  create(itemId: string, createServiceItensDto: CreateServiceItensDto) {
    return 'This action adds a new service';
  }

  update(id: string, itemId: string, updateServiceItensDto: UpdateServiceItensDto) {
    return `This action updates a #${id} service`;
  }

  remove(id: string, itemId: string) {
    return `This action removes a #${id} service`;
  }
}
