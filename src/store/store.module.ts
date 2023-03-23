import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PartModule } from './part/part.module';
import { MechanicModule } from './mechanic/mechanic.module';

@Module({
  controllers: [StoreController],
  providers: [StoreService],
  imports: [PartModule, MechanicModule]
})
export class StoreModule {}
