import { Entity, model, property } from '@loopback/repository';

@model()
export class UserShop extends Entity {
  @property({
    type: 'number'
  })
  userid: number;

  @property({
    type: 'number',
    id: true,
  })
  usershopid?: number;

  @property({
    type: 'number',
    required: true,
  })
  shopid: number;

  constructor(data?: Partial<UserShop>) {
    super(data);
  }
}
