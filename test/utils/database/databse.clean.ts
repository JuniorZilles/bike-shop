import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { Bike } from '../../../src/client/bike/entities/bike.entity';
import Client from '../../../src/client/entities/client.entity';
import { Feedback } from '../../../src/feedback/entities/feedback.entity';
import { Service } from '../../../src/service/entities/service.entity';
import { Store } from '../../../src/store/entities/store.entity';

export default async (): Promise<void> => {
  ConfigModule.forRoot({ envFilePath: ['.env.test'] });

  const dataSource = await new DataSource({
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT || '5432'),
    username: process.env.TYPEORM_USER,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [Client, Bike, Feedback, Service, Store],
    schema: process.env.TYPEORM_SCHEMA,
    synchronize: Boolean(process.env.TYPEORM_SINCRONIZE || 'false'),
    migrations: [process.env.TYPEORM_MIGRATIONS],
    logging: false
  }).initialize();

  const clientRepository = dataSource.getRepository('client');
  await clientRepository.query('TRUNCATE TABLE client;');
  await dataSource.destroy();
};
