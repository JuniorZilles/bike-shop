import { PartialType } from '@nestjs/swagger';
import { OmitType } from '@nestjs/mapped-types';
import CreateFeedbackDto from './create-feedback.dto';

export default class UpdateFeedbackDto extends OmitType(PartialType(CreateFeedbackDto), ['serviceId']) {}
