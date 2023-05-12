import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import Part from './part.entity';

@Entity('batch')
export default class Batch {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  batchId: string;

  @ApiProperty()
  @Column()
  partId: string;

  @ApiProperty()
  @Column()
  qtd: number;

  @ApiProperty()
  @Column()
  unit: string;

  @ApiProperty()
  @Column()
  nf: string;

  @ApiProperty()
  @Column()
  price: number;

  @JoinColumn({ name: 'partId' })
  @ManyToOne(() => Part, (part) => part.partId, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  part?: Part;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
