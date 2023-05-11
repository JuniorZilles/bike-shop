import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ISearchFeedbackDTO } from '../../dto/search.dto';
import CreateFeedbackDto from '../../dto/create-feedback.dto';
import Feedback from '../../entities/feedback.entity';
import IFeedbackRepository from '../IFeedbackRepository';
import UpdateFeedbackDto from '../../dto/update-feedback.dto';

export default class FeedbackRepository implements IFeedbackRepository {
  private repository: Repository<Feedback>;

  constructor(@InjectRepository(Feedback) repository: Repository<Feedback>) {
    this.repository = repository;
  }

  findAll(options: ISearchFeedbackDTO = { limit: 20, offset: 0 }): Promise<[Feedback[], number]> {
    const { where, offset: skip, limit: take } = options;
    const { serviceIds, ...newWhere } = where;

    if (serviceIds) {
      if (newWhere.serviceId) {
        serviceIds.push(newWhere.serviceId as string);
      }
      newWhere.serviceId = In(serviceIds);
    }

    return this.repository.findAndCount({ skip, take, where: newWhere });
  }

  async update(id: string, feedbackPartial: UpdateFeedbackDto): Promise<number> {
    const feedback = await this.repository.update(id, feedbackPartial);
    return feedback.affected;
  }

  async create(feedback: CreateFeedbackDto): Promise<Feedback> {
    const newFeedback = this.repository.create(feedback);
    return this.repository.save(newFeedback);
  }

  async findOne(where: ISearchFeedbackDTO): Promise<Feedback> {
    return this.repository.findOne(where);
  }
}
