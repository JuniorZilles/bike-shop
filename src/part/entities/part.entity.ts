import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryColumn, OneToMany } from 'typeorm';
import Batch from './batch.entity';

export default class Part {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
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
  @Column()
  isActive: boolean;

  @OneToMany(() => Batch, (batch) => batch.part, { cascade: true })
  batch: Batch[];
}
