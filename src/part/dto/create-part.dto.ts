import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export default class CreatePartDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  storeId: string;
}
