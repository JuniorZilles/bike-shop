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
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import PartService from './part.service';
import CreatePartDto from './dto/create-part.dto';
import UpdatePartDto from './dto/update-part.dto';
import IQueryDTO from './dto/query.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('part')
export default class PartController {
  constructor(private readonly partService: PartService) {}

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
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.partService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePartDto: UpdatePartDto) {
    return this.partService.update(id, updatePartDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.partService.remove(id);
  }
}
