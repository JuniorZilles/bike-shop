import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import ServiceItem from './serviceItem.entity';
import CreateServiceAdditionalItensDto from '../dto/create-service-additiona-itens.dto';

@Entity('service')
export default class Service {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
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
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column()
  isActive: boolean;

  @ApiProperty()
  @Column('text', { array: true })
  additionalItens: CreateServiceAdditionalItensDto[];

  @OneToMany(() => ServiceItem, (serviceItem) => serviceItem.service, { cascade: true })
  itens?: ServiceItem[];
}
