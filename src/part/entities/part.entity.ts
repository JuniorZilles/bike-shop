import { ApiProperty } from '@nestjs/swagger';
import { Column, PrimaryColumn } from 'typeorm';

export default class Part {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
  partId: string;

  @ApiProperty()
  @Column()
  storeId: string;

  @ApiProperty()
  @Column()
  isActive: boolean;
}
