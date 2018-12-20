import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Shop} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ShopRepository extends DefaultCrudRepository<
  Shop,
  typeof Shop.prototype.shopid
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Shop, dataSource);
  }
}
