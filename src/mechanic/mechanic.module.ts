import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import MechanicService from './mechanic.service';
import MechanicController from './mechanic.controller';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import Store from '../store/entities/store.entity';
import Mechanic from './entities/mechanic.entity';
import MechanicRepository from './repository/implementation/MechanicRepository';

@Module({
  controllers: [MechanicController],
  providers: [StoreRepository, MechanicRepository, MechanicService],
  imports: [TypeOrmModule.forFeature([Store, Mechanic])],
  exports: [MechanicRepository]
})
export default class MechanicModule {}
