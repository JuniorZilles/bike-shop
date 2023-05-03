import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export default class CreatePartDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  storeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  manufacturer: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  displayName: string;

  isActive?: boolean;
}
