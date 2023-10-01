import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly entityManger: EntityManager) {}

  async validateUser(email: string, password: string) {
    const user = await this.entityManger.findOne(User, {
      where: { email },
      relations: {
        profile: true,
      },
    });
    if (!user) throw new BadRequestException('일치하는 이메일이 없습니다.');

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword)
      throw new BadRequestException(
        '비밀번호가 다릅니다. 올바른 비밀번호로 다시 시도해주세요.',
      );

    return user;
  }
}
