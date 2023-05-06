import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ParseUUIDPipe,
  HttpCode
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import MechanicService from './mechanic.service';
import CreateMechanicDto from './dto/create-mechanic.dto';
import UpdateMechanicDto from './dto/update-mechanic.dto';

import IQueryDTO from './dto/query.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('mechanic')
export default class MechanicController {
  constructor(private readonly mechanicService: MechanicService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  create(@Body() createMechanicDto: CreateMechanicDto) {
    return this.mechanicService.create(createMechanicDto);
  }

  @Get()
  @ApiOkResponse()
  findAll(@Query() payload: IQueryDTO) {
    return this.mechanicService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mechanicService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMechanicDto: UpdateMechanicDto) {
    return this.mechanicService.update(id, updateMechanicDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mechanicService.update(id, { isActive: false });
  }
}
