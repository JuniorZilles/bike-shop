import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import BikeService from './bike.service';
import BikeController from './bike.controller';
import Client from '../client/entities/client.entity';
import Bike from './entities/bike.entity';
import ClientRepository from '../client/repository/implementation/ClientRepository';

@Module({
  controllers: [BikeController],
  providers: [BikeService],
  imports: [TypeOrmModule.forFeature([Client, Bike]), ClientRepository]
})
export default class BikeModule {}
