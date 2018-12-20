import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
  EntityNotFoundError,
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
import { User, LoggedUser } from '../models';
import { UserRepository, RoleRepository } from '../repositories';
import { Md5 } from 'md5-typescript';
import { Role } from '../models/role.model';
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(RoleRepository)
    public roleRepository: RoleRepository
  ) { }

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': User } } },
      },
    },
  })
  async create( @requestBody() user: User): Promise<User> {
    if (user.password_hash) {
      user.password_hash = Md5.init(user.password_hash);
    }
    return await this.userRepository.create(user);
  }

  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where,
  ): Promise<Count> {
    return await this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': User } },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User)) filter?: Filter,
  ): Promise<User[]> {
    return await this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody() user: User,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where,
  ): Promise<Count> {
    return await this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': User } } },
      },
    },
  })
  async findById( @param.path.number('id') id: number): Promise<User> {
    return await this.userRepository.findById(id, {
      fields: {
        password_hash: false
      }
    });
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'User model instance',
        content: { 'application/json': { schema: { 'x-ts-type': LoggedUser } } },
      },
    },
  })
  async login( @requestBody() user: Partial<User>): Promise<LoggedUser> {
    console.log("LOGGING IN:", user);
    let filter = {
      where: {
        username: user.username,
        password_hash: user.password_hash ? Md5.init(user.password_hash) : ''
      },
      fields: {
        password_hash: false
      }
    }
    let userFound = await this.userRepository.findOne(filter);
    if (userFound) {
      let loggedUser = new LoggedUser({ user: userFound });
      let role = await this.roleRepository.findById(userFound.roleid);
      loggedUser.role = role || new Role();
      return loggedUser;
    } else {
      throw new EntityNotFoundError("User", user.username || "NOT SPECIFIED");
    }
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() newUser: Partial<User>,
  ): Promise<void> {
    let user = await this.userRepository.findById(id);
    if (newUser.password_hash && user.password_hash != newUser.password_hash) {
      user.password_hash = Md5.init(newUser.password_hash);
    }
    user.name = newUser.name || user.name;
    user.lastname = newUser.lastname || user.lastname;
    user.roleid = newUser.roleid || user.roleid;
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById( @param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
