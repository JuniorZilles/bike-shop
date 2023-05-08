import { ApiProperty } from '@nestjs/swagger';
import { Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Service from './service.entity';

export default class ServiceItem {
  @ApiProperty()
  @PrimaryColumn({ generated: 'uuid' })
  serviceItemId: string;

  @ApiProperty()
  @Column()
  partId: string;

  @ApiProperty()
  @Column()
  qtd: number;

  @ApiProperty()
  @Column()
  unitPrice: number;

  @ApiProperty()
  @Column()
  serviceId: string;

  @JoinColumn({ name: 'serviceId' })
  @ManyToOne(() => Service, (service) => service.serviceId, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  service: Service;
}
