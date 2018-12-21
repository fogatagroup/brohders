import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Shelve} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ShelveRepository extends DefaultCrudRepository<
  Shelve,
  typeof Shelve.prototype.shelveid
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Shelve, dataSource);
  }
}
