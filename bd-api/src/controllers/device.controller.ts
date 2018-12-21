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
import {Device} from '../models';
import {DeviceRepository} from '../repositories';

export class DeviceController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository : DeviceRepository,
  ) {}

  @post('/devices', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {'application/json': {schema: {'x-ts-type': Device}}},
      },
    },
  })
  async create(@requestBody() device: Device): Promise<Device> {
    return await this.deviceRepository.create(device);
  }

  @get('/devices/count', {
    responses: {
      '200': {
        description: 'Device model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Device)) where?: Where,
  ): Promise<Count> {
    return await this.deviceRepository.count(where);
  }

  @get('/devices', {
    responses: {
      '200': {
        description: 'Array of Device model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Device}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Device)) filter?: Filter,
  ): Promise<Device[]> {
    return await this.deviceRepository.find(filter);
  }

  @patch('/devices', {
    responses: {
      '200': {
        description: 'Device PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() device: Device,
    @param.query.object('where', getWhereSchemaFor(Device)) where?: Where,
  ): Promise<Count> {
    return await this.deviceRepository.updateAll(device, where);
  }

  @get('/devices/{id}', {
    responses: {
      '200': {
        description: 'Device model instance',
        content: {'application/json': {schema: {'x-ts-type': Device}}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Device> {
    return await this.deviceRepository.findById(id);
  }

  @patch('/devices/{id}', {
    responses: {
      '204': {
        description: 'Device PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() device: Device,
  ): Promise<void> {
    await this.deviceRepository.updateById(id, device);
  }

  @put('/devices/{id}', {
    responses: {
      '204': {
        description: 'Device PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() device: Device,
  ): Promise<void> {
    await this.deviceRepository.replaceById(id, device);
  }

  @del('/devices/{id}', {
    responses: {
      '204': {
        description: 'Device DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.deviceRepository.deleteById(id);
  }
}
