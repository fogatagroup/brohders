import {Entity, model, property} from '@loopback/repository';

@model()
export class Tasting extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  tastingid?: number;

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
  weekday: number;

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

  constructor(data?: Partial<Tasting>) {
    super(data);
  }
}
