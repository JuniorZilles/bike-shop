import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import IBatchRepository from '../IBatchRepository';
import Batch from '../../entities/batch.entity';
import CreateBatchDto from '../../dto/create-batch.dto';
import UpdateBatchDto from '../../dto/update-batch.dto';

export default class BatchRepository implements IBatchRepository {
  private repository: Repository<Batch>;

  constructor(@InjectRepository(Batch) repository: Repository<Batch>) {
    this.repository = repository;
  }

  create(partId: string, batch: CreateBatchDto): Promise<Batch[]> {
    const batchs = batch.items.map((e) => this.repository.create({ ...e, partId }));

    return this.repository.save(batchs);
  }

  async update(id: string, batchId: string, payload: UpdateBatchDto): Promise<number> {
    const batch = await this.repository.update({ partId: id, batchId }, payload);
    return batch.affected;
  }
}
