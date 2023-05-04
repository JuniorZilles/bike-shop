import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateBatchItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  qtd: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nf: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
