import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SessionSerializer } from './serializers/session.serializer';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { UsersModule } from '../users/users.module';
import {
  LocalStrategy,
  GoogleStrategy,
  KakaoStrategy,
  NaverStrategy,
  GithubStrategy,
} from './strategies';

@Module({
  imports: [
    PassportModule.register({ session: true }), //
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    KakaoStrategy,
    NaverStrategy,
    GithubStrategy,
    SessionSerializer,
    {
      provide: APP_GUARD,
      useClass: AuthenticatedGuard,
    },
  ],
})
export class AuthModule {}
