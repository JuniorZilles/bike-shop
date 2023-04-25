import { ApiProperty } from '@nestjs/swagger';
import IQueryDTO from './query.dto';
import Pagination from '../../utils/typeorm/pagination';
import Bike from '../entities/bike.entity';

export interface ISearchBikeDTO extends Pagination {
  where?: IQueryDTO;
}

export class FindAllBike {
  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  items: Bike[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
