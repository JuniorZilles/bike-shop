import CreateBikeDto from '../dto/create-bike.dto';
import { ISearchBikeDTO } from '../dto/search.dto';
import UpdateBikeDto from '../dto/update-bike.dto';
import Bike from '../entities/bike.entity';

export default interface IBikeRepository {
  create(Bike: CreateBikeDto): Promise<Bike>;
  findOne(where: ISearchBikeDTO): Promise<Bike>;
  findAll(options: ISearchBikeDTO): Promise<[Bike[], number]>;
  update(id: string, BikePartial: UpdateBikeDto): Promise<number>;
}
