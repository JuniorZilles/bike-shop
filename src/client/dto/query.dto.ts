import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import Pagination from '../../utils/typeorm/pagination';

export default class IQueryDTO extends Pagination {
  @ApiProperty()
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
