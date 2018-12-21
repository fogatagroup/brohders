import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {UserShop} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class UserShopRepository extends DefaultCrudRepository<
  UserShop,
  typeof UserShop.prototype.usershopid
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(UserShop, dataSource);
  }
}
