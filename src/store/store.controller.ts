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
  ClassSerializerInterceptor
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse
} from '@nestjs/swagger';
import StoreService from './store.service';
import CreateStoreDto from './dto/create-store.dto';
import UpdateStoreDto from './dto/update-store.dto';
import IQueryDTO from './dto/query.dto';
import successResponse from '../utils/response/success';

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
  @ApiOkResponse()
  findAll(@Query() payload: IQueryDTO) {
    return this.storeService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStoreDto: UpdateStoreDto) {
    await this.storeService.update(id, updateStoreDto);
    return successResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.update(id, { isActive: false });
  }
}
