import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import ServiceService from './service.service';
import CreateServiceDto from './dto/create-service.dto';
import CreateServiceItensDto from './dto/create-service-itens.dto';
import UpdateServiceDto from './dto/update-service.dto';
import ServiceItensService from './service-itens.service';
import UpdateServiceItensDto from './dto/update-service-itens.dto';

@Controller('service')
export default class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly serviceItensService: ServiceItensService
  ) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Post(':id/item')
  async createItem(@Param('id') id: string, @Body() createServiceItemDto: CreateServiceItensDto) {
    await this.serviceService.findOne(id);
    return this.serviceItensService.create(id, createServiceItemDto);
  }

  @Patch(':id/item/:itemId')
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateServiceItemDto: UpdateServiceItensDto
  ) {
    await this.serviceService.findOne(id);
    return this.serviceItensService.update(id, itemId, updateServiceItemDto);
  }

  @Delete(':id/item/:itemId')
  async removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    await this.serviceService.findOne(id);
    return this.serviceItensService.remove(id, itemId);
  }
}
