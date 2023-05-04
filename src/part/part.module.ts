import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import PartService from './part.service';
import PartController from './part.controller';
import Store from '../store/entities/store.entity';
import Part from './entities/part.entity';
import PartRepository from './repository/implementation/PartRepository';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import BatchService from './batch.service';
import Batch from './entities/batch.entity';
import BatchRepository from './repository/implementation/BatchRepository';

@Module({
  controllers: [PartController],
  providers: [StoreRepository, PartRepository, PartService, BatchRepository, BatchService],
  imports: [TypeOrmModule.forFeature([Store, Part, Batch])]
})
export default class PartModule {}
