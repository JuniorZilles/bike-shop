import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import ServiceService from './service.service';
import CreateServiceDto from './dto/create-service.dto';
import CreateServiceItensDto from './dto/create-service-itens.dto';
import UpdateServiceDto from './dto/update-service.dto';
import ServiceItensService from './service-itens.service';
import UpdateServiceItensDto from './dto/update-service-itens.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('service')
export default class ServiceController {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly serviceItensService: ServiceItensService
  ) {}

  @Post()
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiOkResponse()
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @ApiOkResponse()
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.serviceService.remove(id);
  }

  @Post(':id/item')
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  async createItem(@Param('id') id: string, @Body() createServiceItemDto: CreateServiceItensDto) {
    await this.serviceService.findOne(id);
    return this.serviceItensService.create(id, createServiceItemDto);
  }

  @Patch(':id/item/:itemId')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() updateServiceItemDto: UpdateServiceItensDto
  ) {
    return this.serviceItensService.update(id, itemId, updateServiceItemDto);
  }

  @Delete(':id/item/:itemId')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.serviceItensService.remove(id, itemId);
  }
}
