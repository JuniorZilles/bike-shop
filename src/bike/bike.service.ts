import { Injectable, NotFoundException } from '@nestjs/common';
import CreateBikeDto from './dto/create-bike.dto';
import UpdateBikeDto from './dto/update-bike.dto';
import ClientRepository from '../client/repository/implementation/ClientRepository';
import BikeRepository from './repository/implementation/BikeRepository';

@Injectable()
export default class BikeService {
  constructor(private readonly clientRepository: ClientRepository, private readonly bikeRepository: BikeRepository) {}

  async create(createBikeDto: CreateBikeDto) {
    const { clientId } = createBikeDto;
    const response = await this.clientRepository.findOne({ where: { clientId } });
    if (response && !response?.isActive) {
      throw new NotFoundException('User not found');
    }
    const bike = await this.bikeRepository.create({ ...createBikeDto, isActive: true });

    return bike;
  }

  findAll() {
    return `This action returns all bike`;
  }

  findOne(id: string) {
    return `This action returns a #${id} bike`;
  }

  update(id: string, updateBikeDto: UpdateBikeDto) {
    return `This action updates a #${id} bike`;
  }

  remove(id: string) {
    return `This action removes a #${id} bike`;
  }
}
