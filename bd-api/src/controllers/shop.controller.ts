import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Shop} from '../models';
import {ShopRepository} from '../repositories';

export class ShopController {
  constructor(
    @repository(ShopRepository)
    public shopRepository : ShopRepository,
  ) {}

  @post('/shops', {
    responses: {
      '200': {
        description: 'Shop model instance',
        content: {'application/json': {schema: {'x-ts-type': Shop}}},
      },
    },
  })
  async create(@requestBody() shop: Shop): Promise<Shop> {
    return await this.shopRepository.create(shop);
  }

  @get('/shops/count', {
    responses: {
      '200': {
        description: 'Shop model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Shop)) where?: Where,
  ): Promise<Count> {
    return await this.shopRepository.count(where);
  }

  @get('/shops', {
    responses: {
      '200': {
        description: 'Array of Shop model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Shop}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Shop)) filter?: Filter,
  ): Promise<Shop[]> {
    return await this.shopRepository.find(filter);
  }

  @patch('/shops', {
    responses: {
      '200': {
        description: 'Shop PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() shop: Shop,
    @param.query.object('where', getWhereSchemaFor(Shop)) where?: Where,
  ): Promise<Count> {
    return await this.shopRepository.updateAll(shop, where);
  }

  @get('/shops/{id}', {
    responses: {
      '200': {
        description: 'Shop model instance',
        content: {'application/json': {schema: {'x-ts-type': Shop}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Shop> {
    return await this.shopRepository.findById(id);
  }

  @patch('/shops/{id}', {
    responses: {
      '204': {
        description: 'Shop PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() shop: Shop,
  ): Promise<void> {
    await this.shopRepository.updateById(id, shop);
  }

  @put('/shops/{id}', {
    responses: {
      '204': {
        description: 'Shop PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() shop: Shop,
  ): Promise<void> {
    await this.shopRepository.replaceById(id, shop);
  }

  @del('/shops/{id}', {
    responses: {
      '204': {
        description: 'Shop DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.shopRepository.deleteById(id);
  }
}
