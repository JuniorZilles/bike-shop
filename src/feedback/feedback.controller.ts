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
  ParseUUIDPipe
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import FeedbackService from './feedback.service';
import CreateFeedbackDto from './dto/create-feedback.dto';
import UpdateFeedbackDto from './dto/update-feedback.dto';
import successResponse from '../utils/response/success';
import IQueryDTO from './dto/query.dto';

@ApiTags('feedback')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('feedback')
export default class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiCreatedResponse()
  @ApiNotFoundResponse()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOkResponse()
  findAll(@Query() payload: IQueryDTO) {
    return this.feedbackService.findAll(payload);
  }

  @Get(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    await this.feedbackService.update(id, updateFeedbackDto);
    return successResponse;
  }
}
