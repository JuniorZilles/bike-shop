import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BikeService from './bike.service';
import BikeController from './bike.controller';
import Client from '../client/entities/client.entity';
import Bike from './entities/bike.entity';
import ClientRepository from '../client/repository/implementation/ClientRepository';
import BikeRepository from './repository/implementation/BikeRepository';

@Module({
  controllers: [BikeController],
  providers: [ClientRepository, BikeRepository, BikeService],
  imports: [TypeOrmModule.forFeature([Client, Bike])]
})
export default class BikeModule {}
