import { Injectable, NotFoundException } from '@nestjs/common';
import CreatePartDto from './dto/create-part.dto';
import UpdatePartDto from './dto/update-part.dto';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import PartRepository from './repository/implementation/PartRepository';
import { storeNotFound } from '../utils/constants/errorMessages';

@Injectable()
export default class PartService {
  constructor(private readonly storeRepository: StoreRepository, private readonly partRepository: PartRepository) {}

  async create(createPartDto: CreatePartDto) {
    const { storeId } = createPartDto;
    const response = await this.storeRepository.findOne({ where: { storeId } });
    if (!response && !response?.isActive) {
      throw new NotFoundException(storeNotFound);
    }
    const part = await this.partRepository.create({ ...createPartDto, isActive: true });

    return part;
  }

  findAll() {
    return `This action returns all part`;
  }

  findOne(id: string) {
    return `This action returns a #${id} part`;
  }

  async update(id: string, updatePartDto: UpdatePartDto) {
    const response = await this.partRepository.update(id, updatePartDto);
    if (!response || response === 0) {
      throw new NotFoundException('Store or Part Not Found');
    }
  }

  remove(id: string) {
    return `This action removes a #${id} part`;
  }
}
