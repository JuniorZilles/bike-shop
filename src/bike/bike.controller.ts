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
  ParseUUIDPipe,
  Query,
  HttpCode
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import BikeService from './bike.service';
import CreateBikeDto from './dto/create-bike.dto';
import UpdateBikeDto from './dto/update-bike.dto';
import IQueryDTO from './dto/query.dto';
import successResponse from '../utils/response/success';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('bike')
export default class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  create(@Body() createBikeDto: CreateBikeDto) {
    return this.bikeService.create(createBikeDto);
  }

  @Get()
  @ApiOkResponse()
  findAll(@Query() payload: IQueryDTO) {
    return this.bikeService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bikeService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBikeDto: UpdateBikeDto) {
    await this.bikeService.update(id, updateBikeDto);
    return successResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bikeService.remove(id);
  }
}
