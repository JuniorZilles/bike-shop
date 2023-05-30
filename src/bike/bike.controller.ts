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
import BikeService from './bike.service';
import CreateBikeDto from './dto/create-bike.dto';
import UpdateBikeDto from './dto/update-bike.dto';
import IQueryDTO from './dto/query.dto';
import successResponse from '../utils/response/success';
import JwtAuthGuard from '../auth/jwt.guard';
import RolesGuard from '../auth/role.guard';
import { Roles } from '../auth/role.decorator';
import Role from '../auth/role.enum';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('bike')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bike')
export default class BikeController {
  constructor(private readonly bikeService: BikeService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Client)
  create(@Body() createBikeDto: CreateBikeDto) {
    return this.bikeService.create(createBikeDto);
  }

  @Get()
  @ApiOkResponse()
  @Roles(Role.Client, Role.Store)
  findAll(@Query() payload: IQueryDTO) {
    return this.bikeService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  @Roles(Role.Client, Role.Store)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bikeService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Client)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBikeDto: UpdateBikeDto) {
    await this.bikeService.update(id, updateBikeDto);
    return successResponse;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiNotFoundResponse()
  @ApiNoContentResponse()
  @Roles(Role.Client)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bikeService.remove(id);
  }
}
