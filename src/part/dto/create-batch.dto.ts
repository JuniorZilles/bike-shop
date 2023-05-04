import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray } from 'class-validator';
import CreateBatchItemDto from './create-batch-item.dto';

export default class CreateBatchDto {
  @ApiProperty()
  @ArrayMaxSize(250)
  @ArrayMinSize(1)
  @IsArray({ each: true })
  items: CreateBatchItemDto[];
}
