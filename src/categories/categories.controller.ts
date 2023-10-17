import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  // TODO: [관리자] Job/DevCareer 카테고리 추가
  // FIXME: 관리자 권한 추가하기
  @Post(':type')
  addCategory(
    @Param('type') type: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.addCategory(type, createCategoryDto);
  }

  // TODO: [관리자] Job/DevCareer 카테고리 전체조회
  // FIXME: 관리자 권한 추가하기
  @Get(':type')
  fetchCategories(@Param('type') type: string) {
    return this.categoriesService.fetchCategories(type);
  }

  // TODO: [관리자] Job/DevCareer 카테고리 단일조회
  // FIXME: 관리자 권한 추가하기
  @Get(':type/:id')
  fetchCategory(@Param('type') type: string, @Param('id') id: number) {
    return this.categoriesService.fetchCategory(type, id);
  }

  // TODO: [관리자] Job/DevCareer 카테고리 수정
  // FIXME: 관리자 권한 추가하기
  @Patch(':type/:id')
  updateCategory(
    @Param('type') type: string,
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(type, id, updateCategoryDto);
  }

  // TODO: [관리자] Job/DevCareer 카테고리 삭제
  // FIXME: 관리자 권한 추가하기
  @Delete(':type/:id')
  deleteCategory(@Param('type') type: string, @Param('id') id: string) {
    return this.categoriesService.softDeleteCategory(type, id);
  }

  // TODO: [관리자] Job/DevCareer 삭제한 카테고리 복원
  // FIXME: 관리자 권한 추가하기
  @Get(':type/:id/restore')
  restoreCategory(@Param('type') type: string, @Param('id') id: number) {
    return this.categoriesService.restoreCategory(type, id);
  }
}
