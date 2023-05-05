import { ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import IMechanicRepository from '../IMechanicRepository';
import Mechanic from '../../entities/mechanic.entity';
import CreateMechanicDto from '../../dto/create-mechanic.dto';
import { ISearchMechanicDTO } from '../../dto/search.dto';
import UpdateMechanicDto from '../../dto/update-mechanic.dto';

export default class MechanicRepository implements IMechanicRepository {
  private repository: Repository<Mechanic>;

  constructor(@InjectRepository(Mechanic) repository: Repository<Mechanic>) {
    this.repository = repository;
  }

  create(mechanic: CreateMechanicDto): Promise<Mechanic> {
    const newMechanic = this.repository.create(mechanic);
    return this.repository.save(newMechanic);
  }

  findOne(where: ISearchMechanicDTO): Promise<Mechanic> {
    return this.repository.findOne(where);
  }

  findAll(options: ISearchMechanicDTO = { limit: 20, offset: 0 }): Promise<[Mechanic[], number]> {
    const { where, offset: skip, limit: take } = options;
    const { storeIds, ...rest } = where;

    const newWhere: { [name: string]: unknown } = { isActive: true };

    Object.keys(rest).forEach((key) => {
      newWhere[key] = ILike(`%${rest[key]}%`);
    });

    if (storeIds) {
      newWhere.storeId = In<string>(storeIds.split(','));
    }

    return this.repository.findAndCount({ skip, take, where, relations: ['batch'] });
  }

  async update(id: string, mechanicMechanicial: UpdateMechanicDto): Promise<number> {
    const { storeId, ...payload } = mechanicMechanicial;
    const mechanic = await this.repository.update({ mechanicId: id, storeId }, payload);
    return mechanic.affected;
  }

  async setIsActive(id: string, isActive: boolean): Promise<number> {
    const mechanic = await this.repository.update(id, { isActive });
    return mechanic.affected;
  }
}
