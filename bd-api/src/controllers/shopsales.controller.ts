// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { ShopRepository, TastingRepository } from '../repositories/index';
import { repository, Filter, CountSchema, Count } from '@loopback/repository';
import { post, get, param, requestBody, getFilterSchemaFor, patch } from '@loopback/rest';
import { Tasting } from '../models/tasting.model';
import { Shop, Sale } from '../models/index';
import { Product } from '../models/product.model';
import { TastingIncrease } from '../models/tasting-increase.model';
import { Shelve } from '../models/shelve.model';



export class ShopSalesController {
  constructor(
    @repository(ShopRepository)
    protected shopRepository: ShopRepository,
  ) { }

  @post('/shops/{id}/sales')
  async createShelve(
    @param.path.number('id') shopId: typeof Shop.prototype.shopid,
    @requestBody() saleData: Sale
    ): Promise<Sale> {
    return await this.shopRepository.sales(shopId).create(saleData);
  }

  @get('/shops/{id}/sales')
  async find(
    @param.path.number('id') shopId: typeof Shop.prototype.shopid,
    @param.query.object('filter', getFilterSchemaFor(Sale)) filter?: Filter<Sale>
    ): Promise<Sale[]> {
    return await this.shopRepository.sales(shopId).find(filter);
  }

  /*
  @patch('/shops/{id}/sales/{productid}', {
    responses: {
      '200': {
        description: 'Shop sale PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() sale: Partial<Sale>,
    @param.path.number('id') shopid: typeof Shop.prototype.shopid,
    @param.path.number('productid') productid: typeof Product.prototype.productid
    ): Promise<Count> {
    return await this.shopRepository.sales(shopid).patch({
      
    }, {
        productid: productid
      })
  }
  */
}
