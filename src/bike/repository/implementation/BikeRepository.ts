import { Repository } from 'typeorm';
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

  //findOne(where: ISearchBikeDTO): Promise<Bike> {}
  //findAll(options: ISearchBikeDTO): Promise<[Bike[], number]> {}
  //update(id: string, bikePartial: UpdateBikeDto): Promise<number> {}
}
