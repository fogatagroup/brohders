import {Entity, model, property} from '@loopback/repository';

@model()
export class Role extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  roleid?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  pages?: string[];

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

  constructor(data?: Partial<Role>) {
    super(data);
  }
}
