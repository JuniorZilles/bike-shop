import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import CreateBikeDto from './create-bike.dto';

export default class UpdateBikeDto extends PartialType(CreateBikeDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rimSize?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nr?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  clientId?: string;

  isActive?: boolean;
}
