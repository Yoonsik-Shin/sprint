import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../commons/decorators/public.decorator';
import { UserData } from '../commons/decorators/user.decorator';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: 회원가입
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // TODO: 로그인한 유저정보 불러오기
  @Get('/req-user')
  fetchUser(@UserData() user: typeof UserData) {
    return user;
  }

  // TODO: 프로필 업데이트
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // TODO: 회원탈퇴
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  // TODO: 비밀번호 수정

  // TODO: 관리자만 모든 유저정보 불러오기
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // TODO: 관리자만 단일 유저정보 불러오기
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
