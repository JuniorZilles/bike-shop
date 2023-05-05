import { ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import IPartRepository from '../IPartRepository';
import Part from '../../entities/part.entity';
import CreatePartDto from '../../dto/create-part.dto';
import { ISearchPartDTO } from '../../dto/search.dto';
import UpdatePartDto from '../../dto/update-part.dto';

export default class PartRepository implements IPartRepository {
  private repository: Repository<Part>;

  constructor(@InjectRepository(Part) repository: Repository<Part>) {
    this.repository = repository;
  }

  create(part: CreatePartDto): Promise<Part> {
    const newPart = this.repository.create(part);
    return this.repository.save(newPart);
  }

  findOne(where: ISearchPartDTO): Promise<Part> {
    return this.repository.findOne(where);
  }

  findAll(options: ISearchPartDTO = { limit: 20, offset: 0 }): Promise<[Part[], number]> {
    const { where, offset: skip, limit: take } = options;
    const { nf, unit, storeIds, ...rest } = where;

    const newWhere: { [name: string]: unknown } = { isActive: true };

    Object.keys(rest).forEach((key) => {
      newWhere[key] = ILike(`%${rest[key]}%`);
    });

    if (storeIds) {
      newWhere.storeId = In<string>(storeIds.split(','));
    }

    if (nf || unit) {
      newWhere.batch = { nf, unit };
    }

    return this.repository.findAndCount({ skip, take, where, relations: ['batch'] });
  }

  async update(id: string, partPartial: UpdatePartDto): Promise<number> {
    const { storeId, ...payload } = partPartial;
    const part = await this.repository.update({ partId: id, storeId }, payload);
    return part.affected;
  }

  async setIsActive(id: string, isActive: boolean): Promise<number> {
    const part = await this.repository.update(id, { isActive });
    return part.affected;
  }
}
