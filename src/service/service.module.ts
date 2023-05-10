import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ServiceService from './service.service';
import ServiceController from './service.controller';
import Mechanic from '../mechanic/entities/mechanic.entity';
import Client from '../client/entities/client.entity';
import Bike from '../bike/entities/bike.entity';
import Store from '../store/entities/store.entity';
import Part from '../part/entities/part.entity';
import BikeRepository from '../bike/repository/implementation/BikeRepository';
import PartRepository from '../part/repository/implementation/PartRepository';
import ServiceItensService from './service-itens.service';
import ServiceRepository from './repository/implementation/ServiceRepository';
import ServiceItemRepository from './repository/implementation/ServiceItemRepository';
import MechanicRepository from '../mechanic/repository/implementation/MechanicRepository';
import Service from './entities/service.entity';
import ServiceItem from './entities/serviceItem.entity';

@Module({
  controllers: [ServiceController],
  providers: [
    MechanicRepository,
    PartRepository,
    BikeRepository,
    ServiceRepository,
    ServiceItemRepository,
    ServiceItensService,
    ServiceService
  ],
  imports: [TypeOrmModule.forFeature([Store, Part, Mechanic, Client, Bike, Service, ServiceItem])]
})
export default class ServiceModule {}
