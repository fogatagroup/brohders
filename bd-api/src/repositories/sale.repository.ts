import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Sale} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SaleRepository extends DefaultCrudRepository<
  Sale,
  typeof Sale.prototype.ventaid
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Sale, dataSource);
  }
}
