import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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

  isActive?: boolean;
}
