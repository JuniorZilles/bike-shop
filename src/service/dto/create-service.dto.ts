import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import CreateServiceAdditionalItensDto from './create-service-additiona-itens.dto';

export default class CreateServiceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  storeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  mechanicId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  bikeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  @IsArray({ each: true })
  additionalItens: CreateServiceAdditionalItensDto[];

  isActive?: boolean;
}
