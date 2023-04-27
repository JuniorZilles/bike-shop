import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import IBikeRepository from '../IBikeRepository';
import Bike from '../../entities/bike.entity';
import CreateBikeDto from '../../dto/create-bike.dto';
import { ISearchBikeDTO } from '../../dto/search.dto';
import UpdateBikeDto from '../../dto/update-bike.dto';

export default class BikeRepository implements IBikeRepository {
  private repository: Repository<Bike>;

  constructor(@InjectRepository(Bike) repository: Repository<Bike>) {
    this.repository = repository;
  }

  create(bike: CreateBikeDto): Promise<Bike> {
    const newBike = this.repository.create(bike);
    return this.repository.save(newBike);
  }

  findOne(where: ISearchBikeDTO): Promise<Bike> {
    return this.repository.findOne(where);
  }

  findAll(options: ISearchBikeDTO = { limit: 20, offset: 0 }): Promise<[Bike[], number]> {
    const { where, offset: skip, limit: take } = options;

    Object.keys(where).forEach((key) => {
      if (key !== 'rimSize') {
        where[key] = ILike(`%${where[key]}%`);
      }
    });

    where.isActive = true;

    return this.repository.findAndCount({ skip, take, where });
  }

  async update(id: string, bikePartial: UpdateBikeDto): Promise<number> {
    const { clientId, ...payload } = bikePartial;
    const client = await this.repository.update({ bikeId: id, clientId }, payload);
    return client.affected;
  }

  async setIsActive(id: string, isActive: boolean): Promise<number> {
    const client = await this.repository.update(id, { isActive });
    return client.affected;
  }
}
