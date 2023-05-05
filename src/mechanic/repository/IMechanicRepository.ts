import { ISearchMechanicDTO } from '../dto/search.dto';
import CreateMechanicDto from '../dto/create-mechanic.dto';
import UpdateMechanicDto from '../dto/update-mechanic.dto';
import Mechanic from '../entities/mechanic.entity';

export default interface IMechanicRepository {
  create(mechanic: CreateMechanicDto): Promise<Mechanic>;
  findOne(where: ISearchMechanicDTO): Promise<Mechanic>;
  findAll(options: ISearchMechanicDTO): Promise<[Mechanic[], number]>;
  update(id: string, mechanicPartial: UpdateMechanicDto): Promise<number>;
}
