import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { UserData } from '../commons/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { NOT_YET } from '../commons/constants/constants';
import { EmailTokenDto } from './email.dto.ts/email-token.dto';
import { Public } from '../commons/decorators/public.decorator';

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
  @Post()
  tempPasswordEmailTokenVerify(@Body() emailToken: EmailTokenDto) {
    return this.emailService.tempPasswordEmailTokenVerify(emailToken);
  }
}
