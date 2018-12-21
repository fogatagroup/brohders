import { DefaultCrudRepository, juggler, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { Shop } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { Tasting } from '../models/tasting.model';
import { Getter } from '@loopback/context/dist/src/inject';
import { TastingRepository } from './index';

export class ShopRepository extends DefaultCrudRepository<
  Shop,
  typeof Shop.prototype.shopid
  > {

  public readonly tastings: HasManyRepositoryFactory<Tasting, typeof Tasting.prototype.tastingid>
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TastingRepository')
    getTastingsRepository: Getter<TastingRepository>
  ) {
    super(Shop, dataSource);
    this.tastings = this.createHasManyRepositoryFactoryFor('tastings', getTastingsRepository);
  }
}
