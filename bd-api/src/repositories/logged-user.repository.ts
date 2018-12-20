/*
import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {LoggedUser} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LoggedUserRepository extends DefaultCrudRepository<
  LoggedUser,
  typeof LoggedUser.prototype.token
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(LoggedUser, dataSource);
  }
}
*/
