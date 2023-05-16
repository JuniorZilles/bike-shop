import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsLatitude, IsLongitude, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import countryStates from '../../utils/constants/countryStates';

export default class UpdateStoreDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  latitude?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  longitude?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  neighborhood?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(countryStates)
  state?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsPhoneNumber('BR')
  phone?: string;

  isActive?: boolean;
}
