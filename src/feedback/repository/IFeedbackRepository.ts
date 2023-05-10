import { ISearchFeedbackDTO } from '../dto/search.dto';
import CreateFeedbackDto from '../dto/create-feedback.dto';
import UpdateFeedbackDto from '../dto/update-feedback.dto';
import Feedback from '../entities/feedback.entity';

export default interface IFeedbackRepository {
  create(feedback: CreateFeedbackDto): Promise<Feedback>;
  findOne(where: ISearchFeedbackDTO): Promise<Feedback>;
  findAll(options: ISearchFeedbackDTO): Promise<[Feedback[], number]>;
  update(id: string, feedbackPartial: UpdateFeedbackDto): Promise<number>;
}
