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
import {Sale} from '../models';
import {SaleRepository} from '../repositories';

export class SaleController {
  constructor(
    @repository(SaleRepository)
    public saleRepository : SaleRepository,
  ) {}

  @post('/sales', {
    responses: {
      '200': {
        description: 'Sale model instance',
        content: {'application/json': {schema: {'x-ts-type': Sale}}},
      },
    },
  })
  async create(@requestBody() sale: Sale): Promise<Sale> {
    return await this.saleRepository.create(sale);
  }

  @get('/sales/count', {
    responses: {
      '200': {
        description: 'Sale model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Sale)) where?: Where,
  ): Promise<Count> {
    return await this.saleRepository.count(where);
  }

  @get('/sales', {
    responses: {
      '200': {
        description: 'Array of Sale model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Sale}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Sale)) filter?: Filter,
  ): Promise<Sale[]> {
    return await this.saleRepository.find(filter);
  }

  @patch('/sales', {
    responses: {
      '200': {
        description: 'Sale PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() sale: Partial<Sale>,
    @param.query.object('where', getWhereSchemaFor(Sale)) where?: Where,
  ): Promise<Count> {
    return await this.saleRepository.updateAll(sale, where);
  }

  @get('/sales/{id}', {
    responses: {
      '200': {
        description: 'Sale model instance',
        content: {'application/json': {schema: {'x-ts-type': Sale}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Sale> {
    return await this.saleRepository.findById(id);
  }

  @patch('/sales/{id}', {
    responses: {
      '204': {
        description: 'Sale PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() sale: Sale,
  ): Promise<void> {
    await this.saleRepository.updateById(id, sale);
  }

  @put('/sales/{id}', {
    responses: {
      '204': {
        description: 'Sale PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() sale: Sale,
  ): Promise<void> {
    await this.saleRepository.replaceById(id, sale);
  }

  @del('/sales/{id}', {
    responses: {
      '204': {
        description: 'Sale DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.saleRepository.deleteById(id);
  }
}
