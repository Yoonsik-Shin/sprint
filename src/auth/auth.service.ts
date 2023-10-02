import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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

  loginOAuth(user: User, res: Response) {
    res.redirect('https://yoonsik.shop');
  }
}
