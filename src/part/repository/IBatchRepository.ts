import CreateBatchDto from '../dto/create-batch.dto';
import UpdateBatchDto from '../dto/update-batch.dto';
import Batch from '../entities/batch.entity';

export default interface IBatchRepository {
  create(partId: string, batch: CreateBatchDto): Promise<Batch[]>;
  update(id: string, partId: string, batch: UpdateBatchDto): Promise<number>;
}
