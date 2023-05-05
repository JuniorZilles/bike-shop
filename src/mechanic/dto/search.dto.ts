import { ApiProperty } from '@nestjs/swagger';
import Pagination from '../../utils/typeorm/pagination';
import Mechanic from '../entities/mechanic.entity';
import IQueryDTO from './query.dto';

export interface ISearchMechanicDTO extends Pagination {
  where?: IQueryDTO;
}

export class FindAllMechanic {
  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  items: Mechanic[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
