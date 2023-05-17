import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import Bike from '../../../src/bike/entities/bike.entity';
import Client from '../../../src/client/entities/client.entity';
import Feedback from '../../../src/feedback/entities/feedback.entity';
import Service from '../../../src/service/entities/service.entity';
import Store from '../../../src/store/entities/store.entity';
import ServiceItem from '../../../src/service/entities/serviceItem.entity';
import Part from '../../../src/part/entities/part.entity';
import Batch from '../../../src/part/entities/batch.entity';
import Mechanic from '../../../src/mechanic/entities/mechanic.entity';

export default async (): Promise<void> => {
  ConfigModule.forRoot({ envFilePath: ['.env.test'] });

  const dataSource = await new DataSource({
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT || '5432'),
    username: process.env.TYPEORM_USER,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [Client, Bike, Store, Mechanic, Feedback, Service, Part, ServiceItem, Batch],
    schema: process.env.TYPEORM_SCHEMA,
    synchronize: process.env.TYPEORM_SINCRONIZE === 'true',
    migrations: [process.env.TYPEORM_MIGRATIONS],
    logging: false
  }).initialize();

  const feedbackRepository = dataSource.getRepository('feedback');
  await feedbackRepository.query('TRUNCATE TABLE feedback;');

  const serviceItemRepository = dataSource.getRepository('service_item');
  await serviceItemRepository.query('TRUNCATE TABLE service_item;');

  const serviceRepository = dataSource.getRepository('service');
  await serviceRepository.query('TRUNCATE TABLE service CASCADE;');

  const bikeRepository = dataSource.getRepository('bike');
  await bikeRepository.query('TRUNCATE TABLE bike;');

  const clientRepository = dataSource.getRepository('client');
  await clientRepository.query('TRUNCATE TABLE client;');

  const mechanicRepository = dataSource.getRepository('mechanic');
  await mechanicRepository.query('TRUNCATE TABLE mechanic;');

  const batchRepository = dataSource.getRepository('batch');
  await batchRepository.query('TRUNCATE TABLE batch;');

  const partRepository = dataSource.getRepository('part');
  await partRepository.query('TRUNCATE TABLE part CASCADE;');

  const storeRepository = dataSource.getRepository('store');
  await storeRepository.query('TRUNCATE TABLE store;');
  await dataSource.destroy();
};
