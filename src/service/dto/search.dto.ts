import { ApiProperty } from '@nestjs/swagger';
import IQueryDTO from './query.dto';
import Pagination from '../../utils/typeorm/pagination';
import Service from '../entities/service.entity';

export interface ISearchServiceDTO extends Pagination {
  where?: IQueryDTO;
}

export class FindAllService {
  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  items: Service[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
