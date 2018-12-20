import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Role} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.roleid
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Role, dataSource);
  }
}
