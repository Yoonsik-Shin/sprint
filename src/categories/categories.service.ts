import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { EntityManager, IsNull, Not } from 'typeorm';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';
import { Category } from '../categories/entities/category.interface';
import { Job } from '../categories/entities/job.entity';
import { DevCareer } from '../categories/entities/dev-career.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly entityManager: EntityManager) {}

  private async isCategoryExist(entity, dto: CreateCategoryDto) {
    const isExist = await this.entityManager.findOneBy(entity, {
      category: dto.category,
    });
    if (isExist) throw new ConflictException('이미 존재하는 카테고리입니다.');
    return new entity(dto);
  }

  async addCategory(type: string, createCategoryDto: CreateCategoryDto) {
    let newEntity: Category;
    switch (type) {
      case 'job':
        newEntity = await this.isCategoryExist(Job, createCategoryDto);
        break;
      case 'devCareer':
        newEntity = await this.isCategoryExist(DevCareer, createCategoryDto);
        break;
    }
    return this.entityManager.save(newEntity);
  }

  private decideEntity(type: string) {
    let Entity: typeof Job | typeof DevCareer;
    switch (type) {
      case 'job':
        Entity = Job;
        break;
      case 'devCareer':
        Entity = DevCareer;
        break;
    }
    return Entity;
  }

  fetchCategories(type: string) {
    const decidedEntity = this.decideEntity(type);
    return this.entityManager.find(decidedEntity);
  }

  fetchCategory(type: string, id: string) {
    const decidedEntity = this.decideEntity(type);
    return this.entityManager.findOne(decidedEntity, {
      where: { id },
    }) as Promise<Category>;
  }

  async updateCategory(
    type: string,
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.fetchCategory(type, id);
    if (category.category === updateCategoryDto.category)
      throw new ConflictException(
        '기존 카테고리와 변경하려는 카테고리가 같습니다.',
      );
    category.category = updateCategoryDto.category;
    return this.entityManager.save(category);
  }

  async softDeleteCategory(type: string, id: string) {
    const category = this.decideEntity(type);
    const deleteResult = await this.entityManager.softDelete(category, { id });
    if (!deleteResult.affected)
      throw new InternalServerErrorException(
        '서버 오류로 카테고리 삭제에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      status: HttpStatus.OK,
      message: '정상적으로 삭제되었습니다.',
    };
  }

  async restoreCategory(type: string, id: string) {
    const category = this.decideEntity(type);
    const isDeleted = await this.entityManager.findOne(category, {
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    if (!isDeleted)
      throw new BadRequestException('유효하지 않은 카테고리 복구 요청입니다.');
    isDeleted.deletedAt = null;
    const updateResult = await this.entityManager.save(isDeleted);
    if (!updateResult)
      throw new InternalServerErrorException(
        '서버 오류로 카테고리 복원에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      statusCode: HttpStatus.OK,
      message: `${type}/${id} 카테고리 복구에 성공했습니다.`,
    };
  }
}
