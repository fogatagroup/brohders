// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { ClientRepository } from '../repositories/index';
import { Client, Shop } from '../models/index';
import { repository, Filter } from '@loopback/repository';
import { post, get, param, requestBody, getFilterSchemaFor } from '@loopback/rest';


export class ClientShopsController {
  constructor(
    @repository(ClientRepository)
    protected clientRepository: ClientRepository,
  ) { }

  @post('/clients/{id}/shops')
  async createShops(
    @param.path.number('id') clientId: typeof Client.prototype.clientid,
    @requestBody() shopData: Shop
    ): Promise<Shop> {
    return await this.clientRepository.shops(clientId).create(shopData);
  }

  @get('/clients/{id}/shops')
  async find(
    @param.path.number('id') clientId: typeof Client.prototype.clientid,
    @param.query.object('filter', getFilterSchemaFor(Shop)) filter?: Filter<Shop>
    ): Promise<Shop[]> {
    return await this.clientRepository.shops(clientId).find(filter);
  }
}
