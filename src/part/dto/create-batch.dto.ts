import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import CreateBatchItemDto from './create-batch-item.dto';

export default class CreateBatchDto {
  @ApiProperty()
  @ArrayMaxSize(250)
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBatchItemDto)
  items: CreateBatchItemDto[];
}
