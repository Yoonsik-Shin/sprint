import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { Profile } from '../users';

@Injectable()
export class AuthService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUser(email);
    if (!user) throw new BadRequestException('일치하는 이메일이 없습니다.');

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      throw new BadRequestException(
        '비밀번호가 다릅니다. 올바른 비밀번호로 다시 시도해주세요.',
      );

    return user;
  }

  async checkOAuthUser(email: string) {
    const isDeletedUser =
      await this.usersService.validateDeletedUserWithEmail(email);
    if (isDeletedUser)
      throw new BadRequestException(
        '탈퇴한 이력이 있는 이메일입니다. 다른 이메일을 사용해주세요.',
      );

    const user = await this.usersService.findUser(email);
    if (user) return user;

    const newUser = new User({
      email,
      password: uuidv4(),
      profile: new Profile({}),
      job: null,
      devCareer: null,
    });
    return this.entityManager.save(newUser);
  }

  loginOAuth(user: User, res: Response) {
    res.redirect(`${this.configService.get('CLIENT_URL')}/main`);
  }
}
