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
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import ServiceService from './service.service';
import CreateServiceDto from './dto/create-service.dto';
import CreateServiceItensDto from './dto/create-service-itens.dto';
import UpdateServiceDto from './dto/update-service.dto';
import ServiceItensService from './service-itens.service';
import UpdateServiceItensDto from './dto/update-service-itens.dto';
import IQueryDTO from './dto/query.dto';
import successResponse from '../utils/response/success';
import JwtAuthGuard from '../auth/jwt.guard';
import RolesGuard from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import Role from '../auth/role.enum';

@ApiTags('service')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
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
  @Roles(Role.Store, Role.Mechanic)
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiOkResponse()
  @Roles(Role.Store, Role.Mechanic, Role.Client)
  findAll(@Query() payload: IQueryDTO) {
    return this.serviceService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Store, Role.Mechanic, Role.Client)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Store, Role.Mechanic)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateServiceDto: UpdateServiceDto) {
    await this.serviceService.update(id, updateServiceDto);
    return successResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @Roles(Role.Store, Role.Mechanic)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.remove(id);
  }

  @Post(':id/item')
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Store, Role.Mechanic)
  async createItem(@Param('id', ParseUUIDPipe) id: string, @Body() createServiceItemDto: CreateServiceItensDto) {
    const result = await this.serviceService.findOne(id);
    return this.serviceItensService.create(id, { ...createServiceItemDto, storeId: result.storeId });
  }

  @Patch(':id/item/:itemId')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Store, Role.Mechanic)
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
  @Roles(Role.Store, Role.Mechanic)
  async removeItem(@Param('id', ParseUUIDPipe) id: string, @Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.serviceItensService.remove(id, itemId);
  }
}
