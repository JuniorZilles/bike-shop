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
  HttpCode,
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
import MechanicService from './mechanic.service';
import CreateMechanicDto from './dto/create-mechanic.dto';
import UpdateMechanicDto from './dto/update-mechanic.dto';
import successResponse from '../utils/response/success';
import IQueryDTO from './dto/query.dto';
import JwtAuthGuard from '../auth/jwt.guard';
import RolesGuard from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import Role from '../auth/role.enum';

@ApiTags('mechanic')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('mechanic')
export default class MechanicController {
  constructor(private readonly mechanicService: MechanicService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Store)
  create(@Body() createMechanicDto: CreateMechanicDto) {
    return this.mechanicService.create(createMechanicDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse()
  @Roles(Role.Store)
  findAll(@Query() payload: IQueryDTO) {
    return this.mechanicService.findAll(payload);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse()
  @Roles(Role.Store, Role.Client, Role.Mechanic)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mechanicService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse()
  @Roles(Role.Store, Role.Mechanic)
  @ApiNotFoundResponse()
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMechanicDto: UpdateMechanicDto) {
    await this.mechanicService.update(id, updateMechanicDto);
    return successResponse;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @Roles(Role.Store)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mechanicService.remove(id);
  }
}
