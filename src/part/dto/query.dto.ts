import { ApiProperty } from '@nestjs/swagger';
import { FindOperator } from 'typeorm';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import Pagination from '../../utils/typeorm/pagination';

export default class IQueryDTO extends Pagination {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  storeIds?: string;

  storeId?: FindOperator<string> | string;

  partId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nf?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
