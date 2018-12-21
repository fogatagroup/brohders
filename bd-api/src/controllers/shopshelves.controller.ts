// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { ShopRepository, TastingRepository } from '../repositories/index';
import { repository, Filter, CountSchema, Count } from '@loopback/repository';
import { post, get, param, requestBody, getFilterSchemaFor, patch } from '@loopback/rest';
import { Tasting } from '../models/tasting.model';
import { Shop } from '../models/index';
import { Product } from '../models/product.model';
import { TastingIncrease } from '../models/tasting-increase.model';
import { Shelve } from '../models/shelve.model';



export class ShopShelvesController {
  constructor(
    @repository(ShopRepository)
    protected shopRepository: ShopRepository,
  ) { }

  @post('/shops/{id}/shelves')
  async createShelve(
    @param.path.number('id') shopId: typeof Shop.prototype.shopid,
    @requestBody() shelveData: Shelve
    ): Promise<Shelve> {
    return await this.shopRepository.shelves(shopId).create(shelveData);
  }

  @get('/shops/{id}/shelves')
  async find(
    @param.path.number('id') shopId: typeof Shop.prototype.shopid,
    @param.query.object('filter', getFilterSchemaFor(Shelve)) filter?: Filter<Shelve>
    ): Promise<Shelve[]> {
    return await this.shopRepository.shelves(shopId).find(filter);
  }

  @patch('/shops/{id}/shelves/{productid}', {
    responses: {
      '200': {
        description: 'Shop shelve PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() shelve: Partial<Shelve>,
    @param.path.number('id') shopid: typeof Shop.prototype.shopid,
    @param.path.number('productid') productid: typeof Product.prototype.productid
    ): Promise<Count> {
    return await this.shopRepository.shelves(shopid).patch({
      size: shelve.size,
      porcentage: shelve.porcentage
    }, {
        productid: productid
      })
  }
}
