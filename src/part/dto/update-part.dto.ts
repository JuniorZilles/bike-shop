import { PartialType } from '@nestjs/mapped-types';
import CreatePartDto from './create-part.dto';

export default class UpdatePartDto extends PartialType(CreatePartDto) {}
