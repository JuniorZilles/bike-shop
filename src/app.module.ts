import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { ClientModule } from './client/client.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [StoreModule, ClientModule, ServiceModule],
  controllers: [],
  providers: []
})
export default class AppModule {}
