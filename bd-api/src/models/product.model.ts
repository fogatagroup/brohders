import {Entity, model, property} from '@loopback/repository';

@model()
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  productid?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

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
    Type: 'string'
  }) shortName: string;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}
