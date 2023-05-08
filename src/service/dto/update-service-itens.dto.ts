import { PartialType } from '@nestjs/mapped-types';
import CreateServiceItensDto from './create-service-itens.dto';

export default class UpdateServiceItensDto extends PartialType(CreateServiceItensDto) {}
