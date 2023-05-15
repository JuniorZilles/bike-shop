import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import PasswordTransformer from '../../utils/typeorm/password.transformer';

@Entity('store')
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
  @Transform((e) => Number(e.value))
  @Column('decimal')
  latitude: number;

  @ApiProperty()
  @Transform((e) => Number(e.value))
  @Column('decimal')
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
