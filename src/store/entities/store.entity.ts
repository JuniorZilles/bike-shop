import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryColumn } from 'typeorm';
import PasswordTransformer from '../../utils/typeorm/password.transformer';

export default class Store {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
  storeId: string;

  @ApiProperty()
  @Column()
  displayName: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({
    transformer: PasswordTransformer,
    select: false
  })
  password: string;

  @ApiProperty()
  @Column()
  street: string;

  @ApiProperty()
  @Column()
  number: string;

  @ApiProperty()
  @Column({ nullable: true })
  complement?: string;

  @ApiProperty()
  @Column()
  latitude: number;

  @ApiProperty()
  @Column()
  longitude: number;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty()
  @Column()
  neighborhood: string;

  @ApiProperty()
  @Column()
  state: string;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column()
  isActive: boolean;
}
