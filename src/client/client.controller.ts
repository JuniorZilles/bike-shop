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
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse
} from '@nestjs/swagger';
import ClientService from './client.service';
import CreateClientDto from './dto/create-client.dto';
import UpdateClientDto from './dto/update-client.dto';
import successResponse from '../utils/response/success';
import IQueryDTO from './dto/query.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('client')
export default class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiConflictResponse()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  @ApiOkResponse()
  findAll(@Query() payload: IQueryDTO) {
    return this.clientService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClientDto: UpdateClientDto) {
    await this.clientService.update(id, updateClientDto);
    return successResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.clientService.update(id, { isActive: false });
  }
}
