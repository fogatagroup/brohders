import { DefaultCrudRepository, juggler, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { Client, Shop } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { Getter } from '@loopback/context/dist/src/inject';
import { ShopRepository } from './index';

export class ClientRepository extends DefaultCrudRepository<
  Client,
  typeof Client.prototype.clientid
  > {
  public readonly shops: HasManyRepositoryFactory<Shop, typeof Shop.prototype.shopid>
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('ShopRepository')
    getShopRepository: Getter<ShopRepository>
  ) {
    super(Client, dataSource);
    this.shops = this.createHasManyRepositoryFactoryFor('shops', getShopRepository);
  }
}
