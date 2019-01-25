import { Entity, model, property } from '@loopback/repository';

@model()
export class Sale extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  ventaid?: number;

  @property({
    type: 'number',
    required: true,
  })
  semana: number;

  @property({
    type: 'number',
    required: true
  })
  year: number;

  @property({
    type: 'number',
    required: true,
  })
  productid: number;

  @property({
    type: 'number'
  })
  shopid: number;

  @property({
    type: 'number',
    required: true,
  })
  weekday: number;

  @property({
    type: 'number',
    required: false,
  })
  monto?: number;

  @property({
    type: 'number',
    required: true,
  })
  stock: number;

  @property({
    type: 'number',
    required: true,
  })
  dispatch: number;

  @property({
    type: 'number',
    required: false,
  })
  forecast?: number;

  @property({
    type: 'number',
    required: true,
  })
  userid: number;

  @property({
    type: 'number',
    required: false,
  })
  transactionid?: number;

  constructor(data?: Partial<Sale>) {
    super(data);
  }
}
