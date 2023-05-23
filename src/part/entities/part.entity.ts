import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, Entity } from 'typeorm';
import Batch from './batch.entity';

@Entity('part')
export default class Part {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  partId: string;

  @ApiProperty()
  @Column()
  storeId: string;

  @ApiProperty()
  @Column()
  manufacturer: string;

  @ApiProperty()
  @Column()
  displayName: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Batch, (batch) => batch.part, { cascade: true })
  batch?: Batch[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
