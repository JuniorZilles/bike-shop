import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import FeedbackService from './feedback.service';
import FeedbackController from './feedback.controller';
import FeedbackRepository from './repository/implementation/FeedbackRepository';
import ServiceRepository from '../service/repository/implementation/ServiceRepository';
import Service from '../service/entities/service.entity';
import Feedback from './entities/feedback.entity';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackRepository, ServiceRepository, FeedbackService],
  imports: [TypeOrmModule.forFeature([Service, Feedback])]
})
export default class FeedbackModule {}
