import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { EntityManager } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly entityManger: EntityManager) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, user.email);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.entityManger.findOne(User, {
      where: { email: payload },
    });
    const { password, ...userWithoutPw } = user;
    done(null, userWithoutPw);
  }
}
