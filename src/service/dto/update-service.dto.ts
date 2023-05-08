import { PartialType } from '@nestjs/mapped-types';
import CreateServiceDto from './create-service.dto';

export default class UpdateServiceDto extends PartialType(CreateServiceDto) {}
