import { ApiProperty } from '@nestjs/swagger';
import Pagination from '../../utils/typeorm/pagination';
import Store from '../entities/store.entity';
import IQueryDTO from './query.dto';

export interface ISearchStoreDTO extends Pagination {
  where?: IQueryDTO;
}

export class FindAllStore {
  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  items: Store[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
