import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import Service from './service.entity';

@Entity('service_item')
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

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
