import { Entity, model, property, hasMany } from '@loopback/repository';
import { Shop } from './index';

@model()
export class Client extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  clientid?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string'
  })
  description: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isdeleted: boolean;

  @property({
    type: 'boolean',
    default: true,
  })
  isactive: boolean;

  @hasMany(() => Shop, { keyTo: 'clientid' })
  shops?: Shop[];

  constructor(data?: Partial<Client>) {
    super(data);
  }
}
