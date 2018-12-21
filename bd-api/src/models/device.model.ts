import {Entity, model, property} from '@loopback/repository';

@model()
export class Device extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  deviceid?: number;

  @property({
    type: 'string',
    required: true,
  })
  serial: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  isactive?: boolean;

  @property({
    type: 'boolean',
    default: false,
  })
  isdeleted?: boolean;

  constructor(data?: Partial<Device>) {
    super(data);
  }
}
