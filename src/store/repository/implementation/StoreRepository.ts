import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ISearchStoreDTO } from '../../dto/search.dto';
import CreateStoreDto from '../../dto/create-store.dto';
import Store from '../../entities/store.entity';
import IStoreRepository from '../IStoreRepository';
import UpdateStoreDto from '../../dto/update-store.dto';

export default class StoreRepository implements IStoreRepository {
  private repository: Repository<Store>;

  constructor(@InjectRepository(Store) repository: Repository<Store>) {
    this.repository = repository;
  }

  findAll(options: ISearchStoreDTO = { limit: 20, offset: 0 }): Promise<[Store[], number]> {
    const { where, offset: skip, limit: take } = options;

    where.isActive = true;

    const notLike = ['isActive', 'state'];
    Object.keys(where).forEach((key) => {
      if (!notLike.includes(key)) {
        where[key] = ILike(`%${where[key]}%`);
      }
    });
    return this.repository.findAndCount({ skip, take, where });
  }

  async update(id: string, storePartial: UpdateStoreDto): Promise<number> {
    const store = await this.repository.update(id, storePartial);
    return store.affected;
  }

  async create(store: CreateStoreDto): Promise<Store> {
    const newStore = this.repository.create(store);
    return this.repository.save(newStore);
  }

  async findOne(where: ISearchStoreDTO): Promise<Store> {
    return this.repository.findOne(where);
  }
}
