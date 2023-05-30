import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import Pagination from '../../utils/typeorm/pagination';

export default class IQueryDTO extends Pagination {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  storeIds?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  password?: string;

  @IsEmpty()
  storeId?: string;

  @IsEmpty()
  mechanicId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
