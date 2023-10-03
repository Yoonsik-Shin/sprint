import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StudiesService } from './studies.service';
import { UserData } from '../commons/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateStudyDto } from './dto/create-study.dto';
import { Public } from '../commons/decorators/public.decorator';
import { UpdateStudyDto } from './dto/update-study.dto';

@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  /**
   * 스터디
   */
  // TODO: 스터디 생성
  @Post()
  createStudy(@UserData() user: User, @Body() createStudyDto: CreateStudyDto) {
    return this.studiesService.createStudy(user, createStudyDto);
  }

  // TODO: 스터디 전체 조회
  // FIXME: 관리자 권한 부여
  @Get()
  fetchAllStudies() {
    return this.studiesService.fetchAllStudies();
  }

  // TODO: 스터디 단일 조회
  @Get(':id')
  fetchStudy(@Param('id') id: string) {
    return this.studiesService.fetchStudy(id);
  }

  // TODO: 스터디 수정
  @Patch(':id')
  updateStudy(
    @Param('id') id: string,
    @UserData() user: User,
    @Body() updateStudyDto: UpdateStudyDto,
  ) {
    return this.studiesService.updateStudy(id, user, updateStudyDto);
  }

  // TODO: 스터디 삭제
  @Delete(':id')
  deleteStudy(@Param('id') id: string, @UserData() user: User) {
    return this.studiesService.softDeleteStudy(id, user);
  }

  // TODO: 스터디 복구
  restoreStudy(@Param('id') id: string, @UserData() user: User) {
    return this.studiesService.restoreStudy(id, user);
  }

  /**
   * 스터디 신청
   */
  // TODO: 스터디 신청 요청

  // TODO: 스터디 신청 수락

  // TODO: 스터디 신청 거절

  // TODO: 스터디 모집종료

  /**
   * 스터디 문의
   */
  // TODO: 스터디 문의 생성

  // TODO: 스터디 문의 전체 조회

  // TODO: 스터디 문의 단일 조회

  // TODO: 스터디 문의 수정

  // TODO: 스터디 문의 삭제
}
