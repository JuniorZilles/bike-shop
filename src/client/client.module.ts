import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ClientService from './client.service';
import ClientController from './client.controller';
import ClientRepository from './repository/implementation/ClientRepository';
import Client from './entities/client.entity';

@Module({
  controllers: [ClientController],
  providers: [ClientRepository, ClientService],
  imports: [TypeOrmModule.forFeature([Client])]
})
export default class ClientModule {}
