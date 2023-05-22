import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import CreateServiceAdditionalItensDto from './create-service-additiona-itens.dto';

export default class UpdateServiceDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  mechanicId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @ArrayMaxSize(10)
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceAdditionalItensDto)
  additionalItens?: CreateServiceAdditionalItensDto[];
}
