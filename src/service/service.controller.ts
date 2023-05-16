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
  ClassSerializerInterceptor,
  ParseUUIDPipe,
  Query
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import ServiceService from './service.service';
import CreateServiceDto from './dto/create-service.dto';
import CreateServiceItensDto from './dto/create-service-itens.dto';
import UpdateServiceDto from './dto/update-service.dto';
import ServiceItensService from './service-itens.service';
import UpdateServiceItensDto from './dto/update-service-itens.dto';
import IQueryDTO from './dto/query.dto';
import successResponse from '../utils/response/success';

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
  findAll(@Query() payload: IQueryDTO) {
    return this.serviceService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateServiceDto: UpdateServiceDto) {
    await this.serviceService.update(id, updateServiceDto);
    return successResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.remove(id);
  }

  @Post(':id/item')
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  async createItem(@Param('id', ParseUUIDPipe) id: string, @Body() createServiceItemDto: CreateServiceItensDto) {
    const result = await this.serviceService.findOne(id);
    return this.serviceItensService.create(id, { ...createServiceItemDto, storeId: result.storeId });
  }

  @Patch(':id/item/:itemId')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() updateServiceItemDto: UpdateServiceItensDto
  ) {
    await this.serviceItensService.update(id, itemId, updateServiceItemDto);
    return successResponse;
  }

  @Delete(':id/item/:itemId')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async removeItem(@Param('id', ParseUUIDPipe) id: string, @Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.serviceItensService.remove(id, itemId);
  }
}
