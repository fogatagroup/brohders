import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Tasting} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TastingRepository extends DefaultCrudRepository<
  Tasting,
  typeof Tasting.prototype.tastingid
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Tasting, dataSource);
  }
}
