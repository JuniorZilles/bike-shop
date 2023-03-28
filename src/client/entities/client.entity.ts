import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { PrimaryColumn } from 'typeorm/decorator/columns/PrimaryColumn';
import passwordTransformer from '../../utils/typeorm/password.transformer';

@Entity('client')
export default class Client {
  @ApiProperty()
  @PrimaryColumn({ default: randomUUID() })
  clientId: string;

  @ApiProperty()
  email: string;

  @Column({
    transformer: passwordTransformer,
    select: false
  })
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
}
