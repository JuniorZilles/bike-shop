import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import PartService from './part.service';
import CreatePartDto from './dto/create-part.dto';
import UpdatePartDto from './dto/update-part.dto';
import IQueryDTO from './dto/query.dto';
import UpdateBatchDto from './dto/update-batch.dto';
import CreateBatchDto from './dto/create-batch.dto';
import BatchService from './batch.service';
import successResponse from '../utils/response/success';

@ApiTags('part')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('part')
export default class PartController {
  constructor(private readonly partService: PartService, private readonly batchService: BatchService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  create(@Body() createPartDto: CreatePartDto) {
    return this.partService.create(createPartDto);
  }

  @Get()
  @ApiOkResponse()
  findAll(@Query() payload: IQueryDTO) {
    return this.partService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.partService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePartDto: UpdatePartDto) {
    await this.partService.update(id, updatePartDto);
    return successResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.partService.remove(id);
  }

  @Post(':id/batch')
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  async createBatch(@Param('id', ParseUUIDPipe) id: string, @Body() createBatchDto: CreateBatchDto) {
    await this.partService.findOne(id);
    return this.batchService.create(id, createBatchDto);
  }

  @Patch(':id/batch/:batchId')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async updateBatch(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('batchId', ParseUUIDPipe) batchId: string,
    @Body() updateBatchDto: UpdateBatchDto
  ) {
    await this.batchService.update(id, batchId, updateBatchDto);
    return successResponse;
  }
}
