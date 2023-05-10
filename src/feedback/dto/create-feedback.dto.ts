import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export default class CreateFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  serviceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}
