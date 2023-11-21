import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email.service';
import { EmailTokenDto } from './email.dto.ts/email-token.dto';
import { NOT_YET, Public, UserData } from '../commons';
import { User } from '../users';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  /**
   *  첫 로그인
   */
  // TODO: 로그인한 유저 이메일로 토큰 보내기
  @Get('first')
  firstLoginSendToken(@UserData() { email, emailVerified }: User) {
    if (emailVerified !== NOT_YET) return;
    return this.emailService.sendToken(email);
  }

  // TODO: 첫 로그인 토큰 인증
  @Post('first')
  firstLoginTokenVerify(
    @Body() emailToken: EmailTokenDto, //
    @UserData() user: User,
  ) {
    if (user.emailVerified !== NOT_YET) return;
    return this.emailService.firstLoginTokenVerify(emailToken, user);
  }

  // TODO: 첫 로그인한 유저의 다른 이메일로 인증하기
  @Post('first/another')
  firstLoginSendTokenToAnotherEmail(
    @Body() { email }: EmailTokenDto,
    @UserData() user: User,
  ) {
    if (user.emailVerified !== NOT_YET) return;
    if (user.email === email)
      throw new BadRequestException(
        '회원가입하신 이메일과 동일합니다. 다른 이메일로 시도해주세요.',
      );
    return this.emailService.sendToken(email);
  }

  /**
   * 비밀번호 재설정
   */
  // TODO: 비밀번호 재설정 이메일 검증 및 메일 발송 + 비밀번호 재설정 이메일 재전송
  @Public()
  @Post()
  tempPasswordEmailVerifyAndSend(@Body() emailToken: EmailTokenDto) {
    return this.emailService.tempPasswordEmailVerifyAndSend(emailToken);
  }

  // TODO: 비밀번호 재설정 다른 이메일로 인증
  @Public()
  tempPasswordAnotherEmailSend(@Body() emailToken: EmailTokenDto) {
    return this.emailService.tempPasswordAnotherEmailSend(emailToken);
  }

  // TODO: 비밀번호 재설정 토큰 인증
  @Public()
  @Post('verify')
  tempPasswordEmailTokenVerify(@Body() emailToken: EmailTokenDto) {
    return this.emailService.tempPasswordEmailTokenVerify(emailToken);
  }

  // TODO: userService로 부터 임시 비밀번호 받기
  @OnEvent('tempPassword')
  receiveTempPassword({
    user,
    tempPassword,
  }: {
    user: User;
    tempPassword: string;
  }) {
    return this.emailService.receiveTempPassword(user, tempPassword);
  }
}
