import { PartialType } from '@nestjs/mapped-types';
import CreateBatchDtoItem from './create-batch-item.dto';

export default class UpdateBatchDto extends PartialType(CreateBatchDtoItem) {}
