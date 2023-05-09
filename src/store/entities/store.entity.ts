import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
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

  @Column({
    transformer: PasswordTransformer,
    select: false
  })
  @Exclude()
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
  zipCode: string;

  @ApiProperty()
  @Column()
  state: string;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column()
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
