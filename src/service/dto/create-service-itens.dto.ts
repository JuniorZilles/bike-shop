import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export default class CreateServiceItensDto {
  storeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  partId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  qtd: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;
}
