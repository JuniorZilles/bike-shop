import { Injectable } from '@nestjs/common';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';

@Injectable()
export class MechanicService {
  create(createMechanicDto: CreateMechanicDto) {
    return 'This action adds a new mechanic';
  }

  findAll() {
    return `This action returns all mechanic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mechanic`;
  }

  update(id: number, updateMechanicDto: UpdateMechanicDto) {
    return `This action updates a #${id} mechanic`;
  }

  remove(id: number) {
    return `This action removes a #${id} mechanic`;
  }
}
