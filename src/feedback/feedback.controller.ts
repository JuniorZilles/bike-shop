import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  ParseUUIDPipe,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import FeedbackService from './feedback.service';
import CreateFeedbackDto from './dto/create-feedback.dto';
import UpdateFeedbackDto from './dto/update-feedback.dto';
import successResponse from '../utils/response/success';
import IQueryDTO from './dto/query.dto';
import JwtAuthGuard from '../auth/jwt.guard';
import RolesGuard from '../auth/role.guard';
import Role from '../auth/role.enum';
import { Roles } from '../auth/role.decorator';

@ApiTags('feedback')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('feedback')
export default class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Client)
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOkResponse()
  @Roles(Role.Client, Role.Store)
  findAll(@Query() payload: IQueryDTO) {
    return this.feedbackService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Client, Role.Store)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @Roles(Role.Client)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    await this.feedbackService.update(id, updateFeedbackDto);
    return successResponse;
  }
}
