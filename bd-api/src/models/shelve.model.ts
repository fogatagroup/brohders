import {Entity, model, property} from '@loopback/repository';

@model()
export class Shelve extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  shelveid?: number;

  @property({
    type: 'number',
  })
  shopid?: number;

  @property({
    type: 'number',
    required: true,
  })
  productid: number;

  @property({
    type: 'number',
    required: true,
  })
  size: number;

  @property({
    type: 'number',
    required: true,
  })
  porcentage: number;

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

  constructor(data?: Partial<Shelve>) {
    super(data);
  }
}
