// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { ShopRepository, TastingRepository } from '../repositories/index';
import { repository, Filter, CountSchema, Count } from '@loopback/repository';
import { post, get, param, requestBody, getFilterSchemaFor, patch } from '@loopback/rest';
import { Tasting } from '../models/tasting.model';
import { Shop } from '../models/index';
import { Product } from '../models/product.model';
import { TastingIncrease } from '../models/tasting-increase.model';



export class ShopTastingIncreasesController {
  constructor(
    @repository(ShopRepository)
    protected shopRepository: ShopRepository,
  ) { }

  @post('/shops/{id}/tasting-increases')
  async createTastingIncrease(
    @param.path.number('id') shopId: typeof Shop.prototype.shopid,
    @requestBody() tastingIncreaseData: TastingIncrease
    ): Promise<TastingIncrease> {
    return await this.shopRepository.tastingIncreases(shopId).create(tastingIncreaseData);
  }

  @get('/shops/{id}/tasting-increases')
  async find(
    @param.path.number('id') shopId: typeof Shop.prototype.shopid,
    @param.query.object('filter', getFilterSchemaFor(TastingIncrease)) filter?: Filter<TastingIncrease>
    ): Promise<TastingIncrease[]> {
    return await this.shopRepository.tastingIncreases(shopId).find(filter);
  }

  @patch('/shops/{id}/tasting-increases/{productid}', {
    responses: {
      '200': {
        description: 'Shop Tasting PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() tastingIncrease: Partial<TastingIncrease>,
    @param.path.number('id') shopid: typeof Shop.prototype.shopid,
    @param.path.number('productid') productid: typeof Product.prototype.productid
    ): Promise<Count> {
    return await this.shopRepository.tastingIncreases(shopid).patch({
      increment: tastingIncrease.increment
    }, {
        productid: productid
      })
  }
}
