import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import Pagination from '../../utils/typeorm/pagination';

export default class IQueryDTO extends Pagination {
  @ApiProperty()
  @IsOptional()
  @IsString()
  storeIds?: string;

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
  creationDate?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
