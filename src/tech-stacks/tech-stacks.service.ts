import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import {
  HttpStatus,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { EntityManager, Not, IsNull } from 'typeorm';
import { TechStack } from './entities/tech-stack.entity';
import { CreateTechStackDto } from './dto/create-tech-stack.dto';

@Injectable()
export class TechStacksService {
  constructor(private readonly entityManager: EntityManager) {}

  private async isTechStackExist(createTechStack: CreateTechStackDto) {
    const isExist = await this.entityManager.findOneBy(TechStack, {
      stackName: createTechStack.stackName,
    });
    if (isExist) throw new ConflictException('이미 존재하는 기술스택입니다.');
    return new TechStack(createTechStack);
  }

  async addTechStack(createTechStack: CreateTechStackDto) {
    const techStack = await this.isTechStackExist(createTechStack);
    return this.entityManager.save(techStack);
  }

  fetchAllTechStacks() {
    return this.entityManager.find(TechStack);
  }

  fetchTechStack(id: string) {
    return this.entityManager.findOneBy(TechStack, { id });
  }

  async updateTechStack(id: string, updateTechStackDto: UpdateTechStackDto) {
    const techStack = await this.fetchTechStack(id);
    if (techStack.stackName === updateTechStackDto.stackName)
      throw new ConflictException(
        '기존 기술스택과 변경하려는 기술스택이 같습니다.',
      );
    techStack.stackName = updateTechStackDto.stackName;
    return this.entityManager.save(techStack);
  }

  async deleteTechStack(id: string) {
    const deleteResult = await this.entityManager.softDelete(TechStack, { id });
    if (!deleteResult.affected)
      throw new InternalServerErrorException(
        '서버 오류로 기술스택 삭제에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      status: HttpStatus.OK,
      message: '정상적으로 삭제되었습니다.',
    };
  }

  async restoreTechStack(id: string) {
    const isDeleted = await this.entityManager.findOne(TechStack, {
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    if (!isDeleted)
      throw new BadRequestException('유효하지 않은 기술스택 복구 요청입니다.');
    isDeleted.deletedAt = null;
    const updateResult = await this.entityManager.save(isDeleted);
    if (!updateResult)
      throw new InternalServerErrorException(
        '서버 오류로 기술스택 복원에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      statusCode: HttpStatus.OK,
      message: `${id}/${isDeleted.stackName} 기술스택 복구에 성공했습니다.`,
    };
  }
}
