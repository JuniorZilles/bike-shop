import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Bike } from '../client/bike/entities/bike.entity';
import Client from '../client/entities/client.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { Service } from '../service/entities/service.entity';
import { Store } from '../store/entities/store.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test'] : ['.env'] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT || '5432'),
      username: process.env.TYPEORM_USER,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: [Bike, Client, Feedback, Service, Store],
      schema: process.env.TYPEORM_SCHEMA,
      synchronize: Boolean(process.env.TYPEORM_SINCRONIZE || 'false')
    })
  ]
})
export default class DatabaseModule {}
