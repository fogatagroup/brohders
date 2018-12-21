// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { ShopRepository, TastingRepository } from '../repositories/index';
import { repository, Filter, CountSchema, Count } from '@loopback/repository';
import { post, get, param, requestBody, getFilterSchemaFor, patch } from '@loopback/rest';
import { Tasting } from '../models/tasting.model';
import { Shop } from '../models/index';
import { Product } from '../models/product.model';



export class ShopTastingsController {
  constructor(
    @repository(ShopRepository)
    protected shopRepository: ShopRepository,
  ) { }

  @post('/shops/{id}/tastings')
  async createTastings(
    @param.path.number('id') shopId: typeof Shop.prototype.shopid,
    @requestBody() tastingData: Tasting
    ): Promise<Tasting> {
    return await this.shopRepository.tastings(shopId).create(tastingData);
  }

  @get('/shops/{id}/tastings')
  async find(
    @param.path.number('id') shopId: typeof Shop.prototype.shopid,
    @param.query.object('filter', getFilterSchemaFor(Tasting)) filter?: Filter<Tasting>
    ): Promise<Tasting[]> {
    return await this.shopRepository.tastings(shopId).find(filter);
  }

  @patch('/shops/{id}/tastings/{productid}', {
    responses: {
      '200': {
        description: 'Shop Tasting PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() tasting: Partial<Tasting>,
    @param.path.number('id') shopid: typeof Shop.prototype.shopid,
    @param.path.number('productid') productid: typeof Product.prototype.productid
    ): Promise<Count> {
    return await this.shopRepository.tastings(shopid).patch({
      isactive: tasting.isactive
    }, {
        productid: productid,
        weekday: tasting.weekday
      })
  }
}
