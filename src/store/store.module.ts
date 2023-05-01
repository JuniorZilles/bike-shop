import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StoreService from './store.service';
import StoreController from './store.controller';
import StoreRepository from './repository/implementation/StoreRepository';
import Store from './entities/store.entity';

@Module({
  controllers: [StoreController],
  providers: [StoreRepository, StoreService],
  imports: [TypeOrmModule.forFeature([Store])]
})
export default class StoreModule {}
