import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createUserDto: CreateUserDto) {
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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
