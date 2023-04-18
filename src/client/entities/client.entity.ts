import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn';
import PasswordTransformer from '../../utils/typeorm/password.transformer';

@Entity('client')
export default class Client {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
  clientId: string;

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
  name: string;

  @ApiProperty()
  @Column()
  birthday: Date;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Client>) {
    Object.assign(this, partial);
  }
}
