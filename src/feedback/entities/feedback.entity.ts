import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('feedback')
export default class Feedback {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
  feedbackId: string;

  @ApiProperty()
  @Column()
  serviceId: string;

  @ApiProperty()
  @Column()
  rating: number;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
