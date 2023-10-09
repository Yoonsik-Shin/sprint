import { EmailService } from './../email/email.service';
import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { arrayToTrueObject } from '../commons/utils/arrayToTrueObject';
import { USER_RELATIONS } from './enum/users.enum';
import { v4 as uuidv4 } from 'uuid';
import { Job } from '../categories/entities/job.entity';
import { DevCareer } from '../categories/entities/dev-career.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly emailService: EmailService,
  ) {}

  /**
   * 유저
   */
  private findUserWithRelations(
    whereOption: string,
    ...relationsArray: USER_RELATIONS[]
  ) {
    const relations = arrayToTrueObject(relationsArray);
    return this.entityManager.findOne(User, {
      where: [{ id: whereOption }, { email: whereOption }],
      relations,
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const isUser = await this.entityManager.findOne(User, { where: { email } });
    if (isUser) throw new ConflictException('이미 등록된 이메일입니다.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      profile: new Profile({}),
      job: null,
      devCareer: null,
    });

    const isCreated = await this.entityManager.save(user);
    if (!isCreated)
      throw new InternalServerErrorException(
        '서버 오류로 회원가입에 실패했습니다. 다시 시도해주세요.',
      );

    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 회원가입 되었습니다.',
    };
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    user.profile = new Profile(updateUserDto.profile);
    user.job = new Job(updateUserDto.job);
    user.devCareer = new DevCareer(updateUserDto.devCareer);
    const updatedUser = await this.entityManager.save(user);
    if (!updatedUser)
      throw new InternalServerErrorException(
        '서버 오류로 업데이트에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 업데이트 되었습니다.',
      user: updatedUser,
    };
  }

  async softDeleteUser(id: string) {
    const deleteResult = await this.entityManager.softDelete(User, { id });
    if (!deleteResult.affected)
      throw new InternalServerErrorException(
        '서버 오류로 회원탈퇴에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      status: HttpStatus.OK,
      message: '정상적으로 회원탈퇴 되었습니다.',
    };
  }

  /**
   * 비밀번호 관련 서비스
   */
  private comparePassword(updateUserDto: UpdateUserDto, user: User) {
    return bcrypt.compare(updateUserDto.password, user.password);
  }

  async checkPassword(user: User, updateUserDto: UpdateUserDto) {
    const comparePassword = await this.comparePassword(updateUserDto, user);
    if (!comparePassword)
      throw new BadRequestException(
        '비밀번호가 다릅니다. 올바른 비밀번호로 다시 시도해주세요.',
      );
    return {
      statusCode: HttpStatus.OK,
      message: '인증에 성공하였습니다. 새로운 비밀번호를 입력해주세요.',
    };
  }

  issueTempPassword(user: User) {
    const tempPassword = uuidv4();
    this.emailService.sendToken(user.email);
    user.password = tempPassword;
    return this.entityManager.save(user);
  }

  async resetPassword(updateUserDto: UpdateUserDto, user: User) {
    const comparePassword = await this.comparePassword(updateUserDto, user);
    if (comparePassword)
      throw new BadRequestException(
        '기존에 이용했던 비밀번호입니다. 다른 비밀번호를 사용해주세요.',
      );
    const newHashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    user.password = newHashedPassword;
    return this.entityManager.save(user);
  }

  /**
   * 로그인한 최신 유저정보
   * 관리자용
   */
  findUser(idOrEmail: string) {
    return this.findUserWithRelations(
      idOrEmail,
      ...Object.values(USER_RELATIONS),
    );
  }

  findAllUsers() {
    return this.entityManager.find(User, {
      relations: arrayToTrueObject(Object.values(USER_RELATIONS)),
    });
  }
}
