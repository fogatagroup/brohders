import { Entity, model, property } from '@loopback/repository';

@model()
export class Transaction extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  transactionid?: number;

  @property({
    type: 'number',
    required: true,
  })
  userid: number;

  @property({
    type: 'number',
    required: true,
  })
  shopid: number;

  @property({
    type: 'string',
    required: true,
  })
  created: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'number',
    required: true,
  })
  week: number;

  @property({
    type: 'number',
    required: true,
  })
  year: number;

  @property({
    type: 'number',
    required: true,
  })
  weekday: number;

  @property({
    type: 'string',
    required: true,
  })
  transactiondate: string;

  @property({
    type: 'boolean',
    required: false,
    default: false
  })
  ventaactualizada: boolean;

  @property({
    type: 'string',
    required: false
  })
  comentario: string;

  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}
