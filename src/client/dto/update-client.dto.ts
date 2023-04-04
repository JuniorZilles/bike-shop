import { IsDateString, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateClientDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString({ strict: true })
  birthday?: Date;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
