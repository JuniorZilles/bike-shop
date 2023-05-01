import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MechanicService } from './mechanic.service';
import { CreateMechanicDto } from './dto/create-mechanic.dto';
import { UpdateMechanicDto } from './dto/update-mechanic.dto';

@Controller('mechanic')
export class MechanicController {
  constructor(private readonly mechanicService: MechanicService) {}

  @Post()
  create(@Body() createMechanicDto: CreateMechanicDto) {
    return this.mechanicService.create(createMechanicDto);
  }

  @Get()
  findAll() {
    return this.mechanicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mechanicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMechanicDto: UpdateMechanicDto) {
    return this.mechanicService.update(+id, updateMechanicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mechanicService.remove(+id);
  }
}
