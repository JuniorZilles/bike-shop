import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import PasswordTransformer from '../../utils/typeorm/password.transformer';

@Entity('mechanic')
export default class Mechanic {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
  mechanicId: string;

  @ApiProperty()
  @Column()
  storeId: string;

  @ApiProperty()
  @Column()
  name: string;

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
  phone: string;

  @ApiProperty()
  @Column()
  hiringDate: Date;

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
