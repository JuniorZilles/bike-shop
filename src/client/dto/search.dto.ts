import { ApiProperty } from '@nestjs/swagger';
import Pagination from '../../utils/typeorm/pagination';
import Client from '../entities/client.entity';
import IQueryDTO from './query.dto';

export interface ISearchClientDTO extends Pagination {
  where?: IQueryDTO;
}

export class FindAllClient {
  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  items: Client[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
