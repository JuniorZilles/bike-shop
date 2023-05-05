import { PartialType } from '@nestjs/mapped-types';
import CreateMechanicDto from './create-mechanic.dto';

export default class UpdateMechanicDto extends PartialType(CreateMechanicDto) {}
