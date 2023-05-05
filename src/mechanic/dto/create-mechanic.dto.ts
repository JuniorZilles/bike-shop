import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export default class CreateMechanicDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  storeId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

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
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  hiringDate: Date;

  isActive?: boolean;
}
