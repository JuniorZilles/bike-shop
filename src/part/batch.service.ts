import { Injectable, NotFoundException } from '@nestjs/common';
import CreateBatchDto from './dto/create-batch.dto';
import UpdateBatchDto from './dto/update-batch.dto';
import BatchRepository from './repository/implementation/BatchRepository';

@Injectable()
export default class BatchService {
  constructor(private readonly batchRepository: BatchRepository) {}

  async create(id: string, createBatchDto: CreateBatchDto) {
    const part = await this.batchRepository.create(id, createBatchDto);
    return part;
  }

  async update(id: string, batchId: string, updateBatchDto: UpdateBatchDto) {
    const response = await this.batchRepository.update(id, batchId, updateBatchDto);
    if (!response || response === 0) {
      throw new NotFoundException('Part or Batch Not Found');
    }
  }
}
