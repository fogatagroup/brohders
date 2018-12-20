import { Entity, model, property } from '@loopback/repository';

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

  constructor(data?: Partial<Shop>) {
    super(data);
  }
}
