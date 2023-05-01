import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword, IsEmail, IsPhoneNumber, IsDateString } from 'class-validator';

export default class CreateClientDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  birthday: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phone: string;

  isActive?: boolean;
}
