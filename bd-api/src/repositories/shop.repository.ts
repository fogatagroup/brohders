import { DefaultCrudRepository, juggler, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { Shop, Sale } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { Tasting } from '../models/tasting.model';
import { Getter } from '@loopback/context/dist/src/inject';
import { TastingRepository, TastingIncreaseRepository, ShelveRepository, SaleRepository } from './index';
import { TastingIncrease } from '../models/tasting-increase.model';
import { Shelve } from '../models/shelve.model';

export class ShopRepository extends DefaultCrudRepository<
  Shop,
  typeof Shop.prototype.shopid
  > {

  public readonly tastings: HasManyRepositoryFactory<Tasting, typeof Tasting.prototype.tastingid>
  public readonly tastingIncreases: HasManyRepositoryFactory<TastingIncrease, typeof TastingIncrease.prototype.tastingincreaseid>
  public readonly shelves: HasManyRepositoryFactory<Shelve, typeof Shelve.prototype.shelveid>
  public readonly sales: HasManyRepositoryFactory<Sale, typeof Sale.prototype.ventaid>
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TastingRepository')
    getTastingsRepository: Getter<TastingRepository>,
    @repository.getter('TastingIncreaseRepository')
    getTastingIncreasesRepository: Getter<TastingIncreaseRepository>,
    @repository.getter('ShelveRepository')
    getShelvesRepository: Getter<ShelveRepository>,
    @repository.getter('SaleRepository')
    getSalesRepository: Getter<SaleRepository>
  ) {
    super(Shop, dataSource);
    this.tastings = this.createHasManyRepositoryFactoryFor('tastings', getTastingsRepository);
    this.tastingIncreases = this.createHasManyRepositoryFactoryFor('tastingIncreases', getTastingIncreasesRepository);
    this.shelves = this.createHasManyRepositoryFactoryFor('shelves', getShelvesRepository);
    this.sales = this.createHasManyRepositoryFactoryFor('sales', getSalesRepository);
  }
}
