import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {TastingIncrease} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TastingIncreaseRepository extends DefaultCrudRepository<
  TastingIncrease,
  typeof TastingIncrease.prototype.tastingincreaseid
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(TastingIncrease, dataSource);
  }
}
