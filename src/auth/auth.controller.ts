import { Controller, Post, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserData } from '../commons/decorators/user.decorator';
import { LoginAuthGuard } from './guards/login-auth.guard';
import { Public } from '../commons/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: 로그인
  @Public()
  @UseGuards(LoginAuthGuard)
  @Post()
  login(@UserData() user: typeof UserData) {
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 로그인되었습니다.',
      user,
    };
  }

  // TODO: 소셜로그인

  // TODO: 로그아웃
}
