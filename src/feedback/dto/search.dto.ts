import { ApiProperty } from '@nestjs/swagger';
import Pagination from '../../utils/typeorm/pagination';
import IQueryDTO from './query.dto';
import Feedback from '../entities/feedback.entity';

export interface ISearchFeedbackDTO extends Pagination {
  where?: IQueryDTO;
}

export class FindAllFeedback {
  @ApiProperty()
  totalResults: number;

  @ApiProperty()
  items: Feedback[];

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
