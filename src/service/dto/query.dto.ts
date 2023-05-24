import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsDateString, IsOptional, IsString } from 'class-validator';
import Pagination from '../../utils/typeorm/pagination';

export default class IQueryDTO extends Pagination {
  @ApiProperty()
  @IsOptional()
  @IsString()
  storeIds?: string;

  serviceId?: string;

  clientId?: string;

  mechanicId?: string;

  storeId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  mechanicIds?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  clientIds?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bikeIds?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  creationDate?: string;

  @ApiProperty()
  @IsOptional()
  @IsBooleanString()
  isActive?: string | boolean;
}
