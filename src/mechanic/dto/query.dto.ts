import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import Pagination from '../../utils/typeorm/pagination';

export default class IQueryDTO extends Pagination {
  @ApiProperty()
  @IsOptional()
  @IsString()
  storeIds?: string;

  @IsEmpty()
  storeId?: string;

  @IsEmpty()
  mechanicId?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
