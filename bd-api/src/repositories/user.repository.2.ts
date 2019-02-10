import { DefaultCrudRepository, juggler, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { User } from '../models';
import { DbDataSource, PostgresDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { UserShop } from '../models/user-shop.model';
import { UserShopRepository } from './index';
import { Getter } from '@loopback/context/dist/src/inject';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.userid
  > {
  public readonly userShops: HasManyRepositoryFactory<UserShop, typeof UserShop.prototype.usershopid>

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('UserShopRepository')
    getUserShopRepository: Getter<UserShopRepository>
  ) {
    super(User, dataSource);
    this.userShops = this.createHasManyRepositoryFactoryFor('userShops', getUserShopRepository);
  }
}
