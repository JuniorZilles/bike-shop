import { ApiProperty } from '@nestjs/swagger';
import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Part from './part.entity';

export default class Batch {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
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
  part: Part;
}
