import { PartialType } from '@nestjs/mapped-types';
import CreateStoreDto from './create-store.dto';

export default class UpdateStoreDto extends PartialType(CreateStoreDto) {}
