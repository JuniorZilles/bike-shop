import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export default class Pagination {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform((params) => Number(params.value))
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform((params) => Number(params.value))
  @IsNumber()
  offset?: number;
}
