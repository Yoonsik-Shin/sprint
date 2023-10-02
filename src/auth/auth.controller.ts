import {
  Controller,
  Post,
  HttpStatus,
  UseGuards,
  Get,
  Redirect,
  Res,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserData } from '../commons/decorators/user.decorator';
import { LoginAuthGuard } from './guards/login-auth.guard';
import { Public } from '../commons/decorators/public.decorator';
import { SocialAuthGuard } from './guards/social-auth.guard';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';

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
  // FIXME: 아직 안됨
  @Public()
  @UseGuards(SocialAuthGuard)
  @Get(':social')
  loginOAuth(@UserData() user: User, @Res() res: Response) {
    return this.authService.loginOAuth(user, res);
  }

  // TODO: 로그아웃
  @Get()
  logout(@Session() session: Record<string, any>, @Res() res: Response) {
    session.destroy(() => {
      // FIXME: 어디로 리다이렉트할지 수정필요
      // res.redirect('/');
    });
  }
}
