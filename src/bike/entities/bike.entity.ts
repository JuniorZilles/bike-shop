import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('bike')
export default class Bike {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
  bikeId: string;

  @ApiProperty()
  @Column()
  displayName: string;

  @ApiProperty()
  @Column()
  color: string;

  @ApiProperty()
  @Column()
  rimSize: number;

  @ApiProperty()
  @Column({ nullable: true })
  brand: string;

  @ApiProperty()
  @Column({ nullable: true })
  nr: string;

  @ApiProperty()
  @Column()
  clientId: string;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Bike>) {
    Object.assign(this, partial);
  }
}
