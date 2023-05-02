import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import CreateStoreDto from './dto/create-store.dto';
import UpdateStoreDto from './dto/update-store.dto';
import StoreRepository from './repository/implementation/StoreRepository';

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

  findAll() {
    return `This action returns all store`;
  }

  findOne(id: string) {
    return `This action returns a #${id} store`;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const response = await this.storeRepository.update(id, updateStoreDto);
    if (!response || response === 0) {
      throw new NotFoundException('Store Not Found');
    }
  }

  remove(id: string) {
    return `This action removes a #${id} store`;
  }
}
