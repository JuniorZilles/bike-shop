import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import ServiceItem from './serviceItem.entity';

export default class Service {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
  serviceId: string;

  @ApiProperty()
  @Column()
  storeId: string;

  @ApiProperty()
  @Column()
  mechanicId: string;

  @ApiProperty()
  @Column()
  clientId: string;

  @ApiProperty()
  @Column()
  bikeId: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column()
  isActive: boolean;

  @OneToMany(() => ServiceItem, (serviceItem) => serviceItem.service, { cascade: true })
  itens: ServiceItem[];
}
