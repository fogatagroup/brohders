import { Provider, inject, ValueOrPromise } from '@loopback/context';
import { Strategy } from 'passport';
import {
  AuthenticationBindings,
  AuthenticationMetadata,
  UserProfile,
} from '@loopback/authentication';
import { BasicStrategy } from 'passport-http';
/*9
import { repository } from '@loopback/repository';
import { UserRepository } from '../repositories/index';
import { Md5 } from 'md5-typescript';
import { Partial } from 'lodash';
import { User } from '../models/index';

export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata,
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }

  value(): ValueOrPromise<Strategy | undefined> {
    // The function was not decorated, so we shouldn't attempt authentication
    if (!this.metadata) {
      return undefined;
    }

    const name = this.metadata.strategy;
    if (name === 'BasicStrategy') {
      return new BasicStrategy(this.verify);
    } else {
      return Promise.reject(`The strategy ${name} is not available.`);
    }
  }

  async verify(
    username: string,
    password: string,
    cb: (err: Error | null, user?: User | false) => void,
  ) {
    let user = await this.userRepository.findOne({
      where: {
        username: username,
        password_hash: Md5.init(password)
      },
      fields: {
        password_hash: false
      }
    })
    cb(null, !user ? false : user);
    // call cb(null, false) when user not found
    // call cb(null, user) when user is authenticated
  }
}
*/
