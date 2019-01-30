// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { ShopRepository, TastingRepository, TransactionRepository } from '../repositories/index';
import { repository, Filter, CountSchema, Count } from '@loopback/repository';
import { post, get, param, requestBody, getFilterSchemaFor, patch } from '@loopback/rest';
import { Tasting } from '../models/tasting.model';
import { Shop, Sale, Transaction } from '../models/index';
import { Product } from '../models/product.model';
import { TastingIncrease } from '../models/tasting-increase.model';
import { Shelve } from '../models/shelve.model';



export class TransactionSalesController {
  constructor(
    @repository(TransactionRepository)
    protected transactionRepository: TransactionRepository,
  ) { }
  /*
    @post('/transactions/{id}/sales')
    async createShelve(
      @param.path.number('id') transactionId: typeof Transaction.prototype.transactionid,
      @requestBody() saleData: Sale
      ): Promise<Sale> {
      return await this.transactionRepository.sales(transactionId).create(saleData);
    }
  */
  @get('/transactions/{id}/sales')
  async find(
    @param.path.number('id') transactionId: typeof Transaction.prototype.transactionid,
    @param.query.object('filter', getFilterSchemaFor(Sale)) filter?: Filter<Sale>
    ): Promise<Sale[]> {
    return await this.transactionRepository.sales(transactionId).find(filter);
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
