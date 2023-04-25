import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import CreateBikeDto from './create-bike.dto';

export default class UpdateBikeDto extends PartialType(CreateBikeDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  color: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rimSize: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nr: string;
}
