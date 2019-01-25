import { Entity, model, property, hasMany } from '@loopback/repository';
import { Tasting } from './tasting.model';
import { TastingIncrease } from './tasting-increase.model';
import { Shelve } from './shelve.model';
import { Sale } from './index';

@model()
export class Shop extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  shopid?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number'
  })
  clientid: number;

  @property({
    type: 'boolean',
    default: false,
  })
  isdeleted?: boolean;

  @property({
    type: 'boolean',
    default: true,
  })
  isactive?: boolean;

  @property({
    type: 'string',
  })
  description?: string;

  @hasMany(() => Tasting, {
    keyTo: 'shopid'
  })
  tastings?: Tasting[]

  @hasMany(() => TastingIncrease, {
    keyTo: 'shopid'
  })
  tastingIncreases?: TastingIncrease[]

  @hasMany(() => Shelve, {
    keyTo: 'shopid'
  })
  shelves?: Shelve[]

  @hasMany(() => Sale, {
    keyTo: 'shopid'
  })
  sales?: Sale[]

  constructor(data?: Partial<Shop>) {
    super(data);
  }
}
