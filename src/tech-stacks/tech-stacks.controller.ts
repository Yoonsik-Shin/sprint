import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TechStacksService } from './tech-stacks.service';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';

@Controller('tech-stacks')
export class TechStacksController {
  constructor(private readonly techStacksService: TechStacksService) {}

  // TODO: [관리자] 기술스택 추가
  // FIXME: 관리자 권한 추가하기
  @Post()
  addTechStack(@Body() createTechStack: CreateTechStackDto) {
    return this.techStacksService.addTechStack(createTechStack);
  }

  // TODO: [관리자] 기술스택 전체조회
  // FIXME: 관리자 권한 추가하기
  @Get()
  fetchAllTechStacks() {
    return this.techStacksService.fetchAllTechStacks();
  }

  // TODO: [관리자] 기술스택 단일조회
  // FIXME: 관리자 권한 추가하기
  @Get(':id')
  fetchTechStack(@Param('id') id: number) {
    return this.techStacksService.fetchTechStack(id);
  }

  // TODO: [관리자] 기술스택 수정
  // FIXME: 관리자 권한 추가하기
  @Patch(':id')
  updateTechStack(
    @Param('id') id: number,
    @Body() updateTechStackDto: UpdateTechStackDto,
  ) {
    return this.techStacksService.updateTechStack(id, updateTechStackDto);
  }

  // TODO: [관리자] 기술스택 삭제
  // FIXME: 관리자 권한 추가하기
  @Delete(':id')
  deleteTechStack(@Param('id') id: number) {
    return this.techStacksService.deleteTechStack(id);
  }

  // TODO: [관리자] 기술스택 삭제한 카테고리 복원
  // FIXME: 관리자 권한 추가하기
  @Get(':id/restore')
  restoreTechStack(@Param('id') id: number) {
    return this.techStacksService.restoreTechStack(id);
  }
}
