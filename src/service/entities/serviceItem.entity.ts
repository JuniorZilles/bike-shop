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
import Service from './service.entity';
import numberTransformer from '../../utils/typeorm/number.transformer';

@Entity('service_item')
export default class ServiceItem {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  serviceItemId: string;

  @ApiProperty()
  @Column()
  partId: string;

  @ApiProperty()
  @Column()
  qtd: number;

  @ApiProperty()
  @Column('decimal', { transformer: numberTransformer })
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
