import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';
import { FindOperator } from 'typeorm';
import Pagination from '../../utils/typeorm/pagination';

export default class IQueryDTO extends Pagination {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID()
  storeId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID()
  mechanicId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsUUID()
  clientId?: string;

  serviceId?: string | FindOperator<string>;

  feedbackId?: string;

  serviceIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsNumberString()
  rating?: number;
}
