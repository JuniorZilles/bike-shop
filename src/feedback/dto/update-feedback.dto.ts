import { PartialType } from '@nestjs/swagger';
import CreateFeedbackDto from './create-feedback.dto';

export default class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}
