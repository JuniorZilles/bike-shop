import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { BikeModule } from './bike/bike.module';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [BikeModule]
})
export class ClientModule {}
