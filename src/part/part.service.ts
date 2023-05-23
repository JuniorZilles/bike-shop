import { Injectable, NotFoundException } from '@nestjs/common';
import CreatePartDto from './dto/create-part.dto';
import UpdatePartDto from './dto/update-part.dto';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import PartRepository from './repository/implementation/PartRepository';
import { partNotFound, storeNotFound } from '../utils/constants/errorMessages';
import Part from './entities/part.entity';
import { FindAllPart } from './dto/search.dto';
import IQueryDTO from './dto/query.dto';

@Injectable()
export default class PartService {
  constructor(private readonly storeRepository: StoreRepository, private readonly partRepository: PartRepository) {}

  async create(createPartDto: CreatePartDto) {
    const { storeId } = createPartDto;
    const response = await this.storeRepository.findOne({ where: { storeId } });
    if (!response && !response?.isActive) {
      throw new NotFoundException(storeNotFound);
    }
    const part = await this.partRepository.create({ ...createPartDto });

    return part;
  }

  async findAll(query?: IQueryDTO): Promise<FindAllPart> {
    const { limit, offset, ...where } = query;
    const response = await this.partRepository.findAll({ limit, offset, where });
    return { totalResults: response[1], items: response[0], limit: query.limit || 20, offset: query.offset || 0 };
  }

  async findOne(partId: string): Promise<Part> {
    const response = await this.partRepository.findOne({ where: { partId } });
    if (!response) {
      throw new NotFoundException(partNotFound);
    }
    return response;
  }

  async update(id: string, updatePartDto: UpdatePartDto) {
    const response = await this.partRepository.update(id, updatePartDto);
    if (!response || response === 0) {
      throw new NotFoundException('Store or Part Not Found');
    }
  }

  async remove(id: string): Promise<void> {
    const response = await this.partRepository.setIsActive(id, false);
    if (!response || response === 0) {
      throw new NotFoundException(partNotFound);
    }
  }
}
