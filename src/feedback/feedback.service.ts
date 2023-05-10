import { Injectable } from '@nestjs/common';
import CreateFeedbackDto from './dto/create-feedback.dto';
import UpdateFeedbackDto from './dto/update-feedback.dto';
import IQueryDTO from './dto/query.dto';

@Injectable()
export default class FeedbackService {
  create(createFeedbackDto: CreateFeedbackDto) {
    return 'This action adds a new feedback';
  }

  findAll(query?: IQueryDTO) {
    return `This action returns all feedback`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feedback`;
  }

  update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    return `This action updates a #${id} feedback`;
  }
}
