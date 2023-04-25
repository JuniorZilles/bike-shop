import { Module } from '@nestjs/common';

import { StoreModule } from './store/store.module';
import ClientModule from './client/client.module';
import { ServiceModule } from './service/service.module';
import { FeedbackModule } from './feedback/feedback.module';
import DatabaseModule from './database/database.module';
import BikeModule from './bike/bike.module';

@Module({
  imports: [StoreModule, ClientModule, BikeModule, ServiceModule, FeedbackModule, DatabaseModule],
  controllers: [],
  providers: []
})
export default class AppModule {}
