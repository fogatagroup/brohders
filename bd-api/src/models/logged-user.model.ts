import { Model, model, property } from '@loopback/repository';
import { Role } from './role.model';
import { User } from './index';

@model()
export class LoggedUser extends Model {
  @property({
    type: 'object'
  })
  user: Partial<User>;

  @property({
    type: 'object',
  })
  role: Role;

  constructor(data?: Partial<LoggedUser>) {
    super(data);
  }
}
