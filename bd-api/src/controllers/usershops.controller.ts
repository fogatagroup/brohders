// Uncomment these imports to begin using these cool features!

import { inject } from '@loopback/context';
import { UserRepository, ShopRepository } from '../repositories/index';
import { User, Shop } from '../models/index';
import { repository, Filter } from '@loopback/repository';
import { post, get, param, requestBody, getFilterSchemaFor, del } from '@loopback/rest';
import { UserShop } from '../models/user-shop.model';
import { Count } from 'loopback-datasource-juggler';


export class UserShopsController {
  constructor(
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(ShopRepository)
    protected shopRepository: ShopRepository
  ) { }

  @post('/users/{id}/shops')
  async createShops(
    @param.path.number('id') userId: typeof User.prototype.userid,
    @requestBody() shopData: UserShop
    ): Promise<UserShop> {
    return await this.userRepository.userShops(userId).create(shopData);
  }

  @get('/users/{id}/shops')
  async find(
    @param.path.number('id') userId: typeof User.prototype.userid,
    @param.query.object('filter', getFilterSchemaFor(UserShop)) filter?: Filter<UserShop>
    ): Promise<Shop[]> {
    let userShops = await this.userRepository.userShops(userId).find(filter);
    return await this.shopRepository.find({
      where: {
        shopid: {
          inq: userShops.map(u => u.shopid)
        }
      }
    })
  }

  @del('/users/{id}/shops/{shopid}', {
    responses: {
      '204': {
        description: 'UserShop DELETE success',
      },
    },
  })
  async deleteAll( @param.path.number('id') id: number, @param.path.number("shopid") shopid: number): Promise<Count> {
    return await this.userRepository.userShops(id).delete({
      shopid: shopid
    });
  }
}
