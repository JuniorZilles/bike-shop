import { ISearchStoreDTO } from '../dto/search.dto';
import CreateStoreDto from '../dto/create-store.dto';
import UpdateStoreDto from '../dto/update-store.dto';
import Store from '../entities/store.entity';

export default interface IStoreRepository {
  create(store: CreateStoreDto): Promise<Store>;
  findOne(where: ISearchStoreDTO): Promise<Store>;
  findAll(options: ISearchStoreDTO): Promise<[Store[], number]>;
  update(id: string, storePartial: UpdateStoreDto): Promise<number>;
}
