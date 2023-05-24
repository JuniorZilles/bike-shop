import { Injectable, NotFoundException } from '@nestjs/common';
import CreateFeedbackDto from './dto/create-feedback.dto';
import UpdateFeedbackDto from './dto/update-feedback.dto';
import IQueryDTO from './dto/query.dto';
import ServiceRepository from '../service/repository/implementation/ServiceRepository';
import FeedbackRepository from './repository/implementation/FeedbackRepository';
import { feedbackNotFound, serviceNotFound } from '../utils/constants/errorMessages';

@Injectable()
export default class FeedbackService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly feedbackRepository: FeedbackRepository
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    const { serviceId } = createFeedbackDto;

    const responseService = await this.serviceRepository.findOne({ serviceId });
    if (!responseService && !responseService?.isActive) {
      throw new NotFoundException(serviceNotFound);
    }
    const result = await this.feedbackRepository.create(createFeedbackDto);

    return result;
  }

  async findAll(query?: IQueryDTO) {
    const { limit, offset, clientId, mechanicId, storeId, ...where } = query;

    if (clientId || mechanicId || storeId) {
      const response = await this.serviceRepository.findAll({
        limit,
        offset,
        where: { clientId, mechanicId, storeId }
      });
      where.serviceIds = response[0].map((e) => e.serviceId);
    }
    const response = await this.feedbackRepository.findAll({ limit, offset, where });
    return { totalResults: response[1], items: response[0], limit: query.limit || 20, offset: query.offset || 0 };
  }

  async findOne(feedbackId: string) {
    const response = await this.feedbackRepository.findOne({ where: { feedbackId } });
    if (!response) {
      throw new NotFoundException(feedbackNotFound);
    }
    return response;
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    const response = await this.feedbackRepository.update(id, updateFeedbackDto);
    if (!response || response === 0) {
      throw new NotFoundException(feedbackNotFound);
    }
  }
}
