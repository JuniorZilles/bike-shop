import { Module } from '@nestjs/common';
import ClientService from './client.service';
import ClientController from './client.controller';
import { BikeModule } from './bike/bike.module';
import ClientRepository from './repository/implementation/ClientRepository';

@Module({
  controllers: [ClientController],
  providers: [ClientRepository, ClientService],
  imports: [BikeModule]
})
export default class ClientModule {}
