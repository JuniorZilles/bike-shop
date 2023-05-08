import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ServiceService from './service.service';
import ServiceController from './service.controller';
import Mechanic from '../mechanic/entities/mechanic.entity';
import Client from '../client/entities/client.entity';
import Bike from '../bike/entities/bike.entity';
import Store from '../store/entities/store.entity';
import Part from '../part/entities/part.entity';
import ClientRepository from '../client/repository/implementation/ClientRepository';
import BikeRepository from '../bike/repository/implementation/BikeRepository';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import PartRepository from '../part/repository/implementation/PartRepository';
import ServiceItensService from './service-itens.service';
import ServiceRepository from './repository/implementation/ServiceRepository';
import ServiceItemRepository from './repository/implementation/ServiceItemRepository';

@Module({
  controllers: [ServiceController],
  providers: [
    StoreRepository,
    PartRepository,
    ClientRepository,
    BikeRepository,
    ServiceRepository,
    ServiceItemRepository,
    ServiceItensService,
    ServiceService
  ],
  imports: [TypeOrmModule.forFeature([Store, Part, Mechanic, Client, Bike])]
})
export default class ServiceModule {}
