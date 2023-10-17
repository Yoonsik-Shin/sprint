import {
  Injectable,
  BadRequestException,
  UnprocessableEntityException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { EmailTokenDto } from './email.dto.ts/email-token.dto';
import { UsersService } from '../users/users.service';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly transporter: Mail;

  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly config: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly usersService: UsersService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: this.config.getOrThrow('EMAIL_USER'),
        pass: this.config.getOrThrow('EMAIL_PASS'),
      },
    });
  }

  async sendToken(email: string) {
    const emailToken = this.createToken(6);
    const mailOptions: EmailOptions = {
      to: email,
      subject: '[가입인증] 스팸아님',
      html: `
        <div>인증번호</div>
        <div>${emailToken}</div>
      `,
    };
    await this.redis.set(email, emailToken);
    await this.redis.expire(email, 60 * 10);
    return this.transporter.sendMail(mailOptions);
  }

  async firstLoginTokenVerify({ token, email }: EmailTokenDto, user: User) {
    const restoredToken = await this.redis.get(email);
    if (restoredToken === null)
      throw new UnprocessableEntityException(
        '토큰이 만료되었습니다. 다시 인증을 요청해주세요.',
      );
    if (token !== restoredToken)
      throw new BadRequestException(
        '토큰정보가 다릅니다. 올바른 토큰을 입력해주세요.',
      );
    user.emailVerified = email;
    return this.entityManager.save(user);
  }

  /**
   * 비밀번호 재설정
   */
  async tempPasswordEmailVerifyAndSend({ email }: EmailTokenDto) {
    const isExist = await this.checkExistingEmail(email);
    if (!isExist)
      throw new BadRequestException(
        '입력하신 이메일과 일치하는 회원정보가 없습니다.',
      );
    this.sendToken(email);
    return {
      statusCode: HttpStatus.OK,
      email,
    };
  }

  tempPasswordAnotherEmailSend({ email }: EmailTokenDto) {
    return this.sendToken(email);
  }

  async tempPasswordEmailTokenVerify({ token, email }: EmailTokenDto) {
    const restoredToken = await this.redis.get(email);
    if (restoredToken === null)
      throw new UnprocessableEntityException(
        '토큰이 만료되었습니다. 다시 인증을 요청해주세요.',
      );
    if (token !== restoredToken)
      throw new BadRequestException(
        '토큰정보가 다릅니다. 올바른 토큰을 입력해주세요.',
      );
    const user = await this.entityManager.findOne(User, {
      where: [{ email }, { emailVerified: email }],
    });
    const issueTempPasswordSuccess =
      await this.usersService.issueTempPassword(user);
    if (!issueTempPasswordSuccess)
      throw new InternalServerErrorException(
        '서버 오류로 임시 비밀번호 발급에 실패했습니다. 다시 시도해주세요.',
      );
    await this.redis.del(email);
    return {
      statusCode: HttpStatus.OK,
      message: '정상적으로 처리되었습니다.',
    };
  }

  receiveTempPassword(user: User, tempPassword: string) {
    this.sendTempPassword(user.email, tempPassword);
  }

  private sendTempPassword(email: string, tempPassword: string) {
    const mailOptions: EmailOptions = {
      to: email,
      subject: '임시비밀번호 발급',
      html: `
        <div>임시비밀번호</div>
        <div>${tempPassword}</div>
      `,
    };
    return this.transporter.sendMail(mailOptions);
  }

  private createToken(num: number) {
    return String(Math.floor(Math.random() * 10 ** num)).padStart(num, '0');
  }

  private checkExistingEmail(email: string) {
    return this.entityManager.findOne(User, {
      where: [{ email }, { emailVerified: email }],
    });
  }
}
