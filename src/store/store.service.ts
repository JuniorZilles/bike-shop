import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import CreateStoreDto from './dto/create-store.dto';
import UpdateStoreDto from './dto/update-store.dto';
import StoreRepository from './repository/implementation/StoreRepository';
import { FindAllStore } from './dto/search.dto';
import IQueryDTO from './dto/query.dto';

@Injectable()
export default class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async create(createStoreDto: CreateStoreDto) {
    const { email } = createStoreDto;
    const response = await this.findByEmail(email);
    if (response?.isActive) {
      throw new ConflictException('Email already in use');
    }
    const store = await this.storeRepository.create({ ...createStoreDto, isActive: true });

    return store;
  }

  private async findByEmail(email: string) {
    const response = await this.storeRepository.findOne({ where: { email } });
    return response;
  }

  async findAll(query?: IQueryDTO): Promise<FindAllStore> {
    const { limit, offset, ...where } = query;
    const response = await this.storeRepository.findAll({ limit, offset, where });
    return { totalResults: response[1], items: response[0], limit: query.limit || 20, offset: query.offset || 0 };
  }

  async findOne(storeId: string) {
    const response = await this.storeRepository.findOne({ where: { storeId } });
    if (!response) {
      throw new NotFoundException('Store Not Found');
    }
    return response;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const response = await this.storeRepository.update(id, updateStoreDto);
    if (!response || response === 0) {
      throw new NotFoundException('Store Not Found');
    }
  }
}
