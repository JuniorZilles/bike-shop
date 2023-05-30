import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger';
import StoreService from './store.service';
import CreateStoreDto from './dto/create-store.dto';
import UpdateStoreDto from './dto/update-store.dto';
import IQueryDTO from './dto/query.dto';
import successResponse from '../utils/response/success';
import JwtAuthGuard from '../auth/jwt.guard';
import RolesGuard from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import Role from '../auth/role.enum';

@ApiTags('store')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('store')
export default class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiConflictResponse()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse()
  @Roles(Role.Client, Role.Store)
  findAll(@Query() payload: IQueryDTO) {
    return this.storeService.findAll(payload);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Store, Role.Mechanic)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Store)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStoreDto: UpdateStoreDto) {
    await this.storeService.update(id, updateStoreDto);
    return successResponse;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @Roles(Role.Store)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.update(id, { isActive: false });
  }
}
