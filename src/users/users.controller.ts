import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../commons/decorators/public.decorator';
import { UserData } from '../commons/decorators/user.decorator';
import { User } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: 회원가입
  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // TODO: 로그인한 유저정보 불러오기
  @Get('req-user')
  fetchUser(@UserData('id') id: string) {
    return this.usersService.findUser(id);
  }

  // TODO: 프로필 업데이트
  @UseInterceptors(FileInterceptor('image'))
  @Patch('req-user')
  update(
    @UploadedFile() image: Express.Multer.File,
    @UserData() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(image, user, updateUserDto);
  }

  // TODO: 회원탈퇴
  @Delete('req-user')
  softDeleteUser(@UserData('id') id: string) {
    return this.usersService.softDeleteUser(id);
  }

  // TODO: 비밀번호 확인
  @Post('password/check')
  checkPassword(@UserData() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.checkPassword(user, updateUserDto);
  }

  // TODO: 임시비밀번호 발급
  @Get('password/temp')
  issueTempPassword(@UserData() user: User) {
    return this.usersService.issueTempPassword(user);
  }

  // TODO: 비밀번호 리셋
  @Patch('password/reset')
  resetPassword(@UserData() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.resetPassword(updateUserDto, user);
  }

  // TODO: [관리자] 단일 유저정보 불러오기
  // FIXME: 관리자 권한 추가하기
  @Get(':id')
  findOneUser(@Param('id') id: string) {
    return this.usersService.findUser(id);
  }

  // TODO: [관리자] 모든 유저정보 불러오기
  // FIXME: 관리자 권한 추가하기
  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }
}
