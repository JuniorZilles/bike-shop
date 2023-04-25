import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export default class CreateBikeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty()
  @IsNotEmpty()
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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  clientId: string;

  isActive?: boolean;
}
