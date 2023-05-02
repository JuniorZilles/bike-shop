import { ApiProperty } from '@nestjs/swagger';
import IQueryDTO from './query.dto';
import Pagination from '../../utils/typeorm/pagination';
import Part from '../entities/part.entity';

export interface ISearchPartDTO extends Pagination {
  where?: IQueryDTO;
}

export class FindAllPart {
  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  items: Part[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
