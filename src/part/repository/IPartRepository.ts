import CreatePartDto from '../dto/create-part.dto';
import { ISearchPartDTO } from '../dto/search.dto';
import UpdatePartDto from '../dto/update-part.dto';
import Part from '../entities/part.entity';

export default interface IPartRepository {
  create(Part: CreatePartDto): Promise<Part>;
  findOne(where: ISearchPartDTO): Promise<Part>;
  findAll(options: ISearchPartDTO): Promise<[Part[], number]>;
  update(id: string, PartPartial: UpdatePartDto): Promise<number>;
}
