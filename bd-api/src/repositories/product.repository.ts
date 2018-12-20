import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Product} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.productid
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Product, dataSource);
  }
}
