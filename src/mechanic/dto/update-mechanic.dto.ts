import { IsDateString, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateMechanicDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  storeId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsPhoneNumber('BR')
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  hiringDate?: Date;

  isActive?: boolean;
}
