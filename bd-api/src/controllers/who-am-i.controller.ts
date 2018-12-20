// src/controllers/who-am-i.controller.ts
import { inject } from '@loopback/context';
import {
  AuthenticationBindings,
  UserProfile,
  authenticate,
} from '@loopback/authentication';
import { get } from '@loopback/rest';
import { User } from '../models/index';
import { repository } from '@loopback/repository';
import { UserRepository } from '../repositories/index';

export class WhoAmIController {
  constructor(
    @inject(AuthenticationBindings.CURRENT_USER) private user: User,
    @repository(UserRepository) public userRepository: UserRepository
  ) { }

  @authenticate('BasicStrategy')
  @get('/whoami')
  whoAmI(): string {
    return this.user.username;
  }
}
