import { ConflictException, Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} store`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} store`;
  }

  remove(id: number) {
    return `This action removes a #${id} store`;
  }
}
