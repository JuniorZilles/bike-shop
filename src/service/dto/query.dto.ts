import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsDateString, IsOptional, IsString } from 'class-validator';
import Pagination from '../../utils/typeorm/pagination';

export default class IQueryDTO extends Pagination {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  storeIds?: string;

  serviceId?: string;

  clientId?: string;

  mechanicId?: string;

  storeId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mechanicIds?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  clientIds?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bikeIds?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  creationDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  isActive?: string | boolean;
}
