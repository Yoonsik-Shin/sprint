import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';
import { USER_RELATIONS } from '../../users/enum/users.enum';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, user.email);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.usersService.findUser(payload);
    done(null, user);
  }
}
