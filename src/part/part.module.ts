import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import PartService from './part.service';
import PartController from './part.controller';
import Store from '../store/entities/store.entity';
import Part from './entities/part.entity';
import PartRepository from './repository/implementation/PartRepository';
import StoreRepository from '../store/repository/implementation/StoreRepository';

@Module({
  controllers: [PartController],
  providers: [StoreRepository, PartRepository, PartService],
  imports: [TypeOrmModule.forFeature([Store, Part])]
})
export default class PartModule {}
