import {DefaultCrudRepository, juggler} from '@loopback/repository';
import {Device} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class DeviceRepository extends DefaultCrudRepository<
  Device,
  typeof Device.prototype.deviceid
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Device, dataSource);
  }
}
