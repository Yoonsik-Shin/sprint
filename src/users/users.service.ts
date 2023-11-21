import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EntityManager, IsNull, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { arrayToTrueObject } from '../commons';
import { TechStacksService } from '../tech-stacks';
import { FilesService } from '../files';
import { Profile, User } from './entities';
import { CreateUserDto, UpdateUserDto } from './dto';
import { USER_RELATIONS } from './enum/users.enum';
import { DevCareer, Job } from '../categories';

@Injectable()
export class UsersService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly filesService: FilesService,
    private readonly techStacksService: TechStacksService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * 유저
   */
  findUserWithRelations(
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

  // FIXME: 업데이트 수정
  async updateUser(
    image: Express.Multer.File,
    user: User,
    updateUserDto: UpdateUserDto,
  ) {
    if (image) {
      const hasProfileImage = user.profile.profileImg;
      hasProfileImage &&
        (await this.filesService.deleteS3File(hasProfileImage));
      const { url } = await this.filesService.uploadFile(image);
      updateUserDto.profile.profileImg = url;
    }
    const allTechStacks = await this.techStacksService.getTechStack();
    if (!allTechStacks)
      throw new InternalServerErrorException(
        '서버 오류로 기술스택을 찾아오지 못했습니다. 다시 시도해주세요.',
      );
    const techStacks = await this.techStacksService.techStack(updateUserDto);
    user.profile = new Profile(updateUserDto.profile);
    user.job = new Job(updateUserDto.job);
    user.devCareer = new DevCareer(updateUserDto.devCareer);
    user.techStacks = techStacks;
    const updatedUser = await this.entityManager.save(user);
    if (!updatedUser)
      throw new InternalServerErrorException(
        '서버 오류로 업데이트에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 업데이트 되었습니다.',
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

  async issueTempPassword(user: User) {
    const uuid = uuidv4();
    const tempPassword = uuid.substring(0, 8) + uuid.substring(24, 32);
    const hashedTempPassword = await bcrypt.hash(tempPassword, 10);
    user.password = hashedTempPassword;
    await this.entityManager.save(user);
    this.eventEmitter.emit('tempPassword', { user, tempPassword });
    return {
      statusCode: HttpStatus.OK,
      message:
        '성공적으로 임시비밀번호가 발급되었습니다. 이메일을 확인해주세요.',
    };
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
  findUserWithAllRelation(idOrEmail: string) {
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

  findUser(idOrEmail: string) {
    return this.entityManager.findOne(User, {
      where: [{ id: idOrEmail }, { email: idOrEmail }],
    });
  }

  validateDeletedUserWithEmail(email: string) {
    return this.entityManager.findOne(User, {
      where: { email, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
  }
}
