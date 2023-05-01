import {
  IsPhoneNumber,
  IsString,
  IsNotEmpty,
  IsEmail,
  IsLatitude,
  IsNumber,
  IsLongitude,
  IsEnum,
  IsStrongPassword,
  IsOptional
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import countryStates from '../../utils/constants/countryStates';

export default class CreateStoreDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  complement: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(countryStates)
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('BR')
  phone: string;

  isActive?: boolean;
}
