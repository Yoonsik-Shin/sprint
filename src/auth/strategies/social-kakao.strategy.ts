import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { UsersService } from '../../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from '../../users/dto/create-user.dto';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['account_email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email: string = profile._json.kakao_account.email.trim();
    let validatedUser = await this.usersService.findUser(email);
    if (validatedUser) return validatedUser;

    // FIXME: 이메일 전송 구현
    const tempPassword = uuidv4();
    const createUserDto: CreateUserDto = {
      email,
      password: tempPassword,
    };
    await this.usersService.createUser(createUserDto);
    validatedUser = await this.usersService.findUser(email);
    // tempPassword 이메일 전송
    return validatedUser ?? null;
  }
}
