import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import CreateMechanicDto from './dto/create-mechanic.dto';
import UpdateMechanicDto from './dto/update-mechanic.dto';
import { emailInUse, mechanicNotFound, storeNotFound } from '../utils/constants/errorMessages';
import MechanicRepository from './repository/implementation/MechanicRepository';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import { FindAllMechanic } from './dto/search.dto';
import IQueryDTO from './dto/query.dto';

@Injectable()
export default class MechanicService {
  constructor(
    private readonly mechanicRepository: MechanicRepository,
    private readonly storeRepository: StoreRepository
  ) {}

  async create(createMechanicDto: CreateMechanicDto) {
    const { email, storeId } = createMechanicDto;
    const store = await this.storeRepository.findOne({ where: { storeId, isActive: true } });
    if (!store) {
      throw new NotFoundException(storeNotFound);
    }
    await this.findByEmail(email);

    const mechanic = await this.mechanicRepository.create({ ...createMechanicDto, isActive: true });

    return mechanic;
  }

  private async findByEmail(email: string) {
    const response = await this.mechanicRepository.findOne({ where: { email } });
    if (response?.isActive) {
      throw new ConflictException(emailInUse);
    }
    return response;
  }

  async findAll(query?: IQueryDTO): Promise<FindAllMechanic> {
    const { limit, offset, ...where } = query;
    const response = await this.mechanicRepository.findAll({ limit, offset, where });
    return { totalResults: response[1], items: response[0], limit: query.limit || 20, offset: query.offset || 0 };
  }

  async findOne(mechanicId: string) {
    const response = await this.mechanicRepository.findOne({ where: { mechanicId } });
    if (!response) {
      throw new NotFoundException(mechanicNotFound);
    }
    return response;
  }

  async update(id: string, updateMechanicDto: UpdateMechanicDto) {
    const response = await this.mechanicRepository.update(id, updateMechanicDto);
    if (!response || response === 0) {
      throw new NotFoundException('Mechanic or Store Not Found');
    }
  }
}
