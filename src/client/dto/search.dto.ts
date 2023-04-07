import Pagination from '../../utils/typeorm/pagination';
import IQueryDTO from './query.dto';

export default interface ISearchClientDTO extends Pagination {
  where?: IQueryDTO;
}
