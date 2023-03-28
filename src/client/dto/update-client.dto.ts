import { PartialType } from '@nestjs/mapped-types';
import CreateClientDto from './create-client.dto';

export default class UpdateClientDto extends PartialType(CreateClientDto) {}
