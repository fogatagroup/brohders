import { Entity, model, property, hasMany } from '@loopback/repository';
import { UserShop } from './user-shop.model';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  userid?: number;

  @property({
    type: 'string',
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password_hash: string;

  @property({
    type: 'number',
  })
  roleid?: number;

  @property({
    type: 'number',
  })
  deviceid?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  lastname?: string;

  @hasMany(() => UserShop, { keyTo: 'userid' })
  userShops?: UserShop[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
