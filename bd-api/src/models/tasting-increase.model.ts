import {Entity, model, property} from '@loopback/repository';

@model()
export class TastingIncrease extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  tastingincreaseid?: number;

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
  increment: number;

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

  constructor(data?: Partial<TastingIncrease>) {
    super(data);
  }
}
