import { DefaultCrudRepository, juggler, HasManyRepositoryFactory, repository } from '@loopback/repository';
import { Transaction, Sale } from '../models';
import { DbDataSource } from '../datasources';
import { inject } from '@loopback/core';
import { Getter } from '@loopback/context/dist/src/inject';
import { SaleRepository } from './index';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.transactionid
  > {

  public readonly sales: HasManyRepositoryFactory<Sale, typeof Sale.prototype.ventaid>
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('SaleRepository')
    getSalesRepository: Getter<SaleRepository>
  ) {
    super(Transaction, dataSource);
    this.sales = this.createHasManyRepositoryFactoryFor('sales', getSalesRepository);
  }
}
