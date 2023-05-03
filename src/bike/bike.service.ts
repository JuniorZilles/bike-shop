import { Injectable, NotFoundException } from '@nestjs/common';
import CreateBikeDto from './dto/create-bike.dto';
import UpdateBikeDto from './dto/update-bike.dto';
import ClientRepository from '../client/repository/implementation/ClientRepository';
import BikeRepository from './repository/implementation/BikeRepository';
import Bike from './entities/bike.entity';
import { FindAllBike } from './dto/search.dto';
import IQueryDTO from './dto/query.dto';
import { bikeNotFound, userNotFound } from '../utils/constants/errorMessages';

@Injectable()
export default class BikeService {
  constructor(private readonly clientRepository: ClientRepository, private readonly bikeRepository: BikeRepository) {}

  async create(createBikeDto: CreateBikeDto): Promise<Bike> {
    const { clientId } = createBikeDto;
    const response = await this.clientRepository.findOne({ where: { clientId } });
    if (!response && !response?.isActive) {
      throw new NotFoundException(userNotFound);
    }
    const bike = await this.bikeRepository.create({ ...createBikeDto, isActive: true });

    return bike;
  }

  async findAll(query?: IQueryDTO): Promise<FindAllBike> {
    const { limit, offset, ...where } = query;
    const response = await this.bikeRepository.findAll({ limit, offset, where });
    return { totalResults: response[1], items: response[0], limit: query.limit || 20, offset: query.offset || 0 };
  }

  async findOne(bikeId: string): Promise<Bike> {
    const response = await this.bikeRepository.findOne({ where: { bikeId } });
    if (!response) {
      throw new NotFoundException(bikeNotFound);
    }
    return response;
  }

  async update(id: string, updateBikeDto: UpdateBikeDto): Promise<void> {
    const response = await this.bikeRepository.update(id, updateBikeDto);
    if (!response || response === 0) {
      throw new NotFoundException('Bike or User Not Found');
    }
  }

  async remove(id: string): Promise<void> {
    const response = await this.bikeRepository.setIsActive(id, false);
    if (!response || response === 0) {
      throw new NotFoundException(bikeNotFound);
    }
  }
}
