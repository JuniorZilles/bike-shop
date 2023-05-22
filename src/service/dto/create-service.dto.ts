import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
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

  @ApiProperty()
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceAdditionalItensDto)
  additionalItens: CreateServiceAdditionalItensDto[];

  isActive?: boolean;
}
