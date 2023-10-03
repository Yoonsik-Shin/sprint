import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { EntityManager, IsNull, Not } from 'typeorm';
import { TechStack } from '../tech-stacks/entities/tech-stack.entity';
import { CreateStudyDto } from './dto/create-study.dto';
import { User } from '../users/entities/user.entity';
import { Study } from './entities/study.entity';
import { Recruit } from './entities/recruit.entity';
import { UpdateStudyDto } from './dto/update-study.dto';
import { arrayToTrueObject } from '../commons/utils/arrayToTrueObject';
import { STUDY_RELATIONS } from './enum/study.enum';
import { UpdateTechStackDto } from '../tech-stacks/dto/update-tech-stack.dto';
import { CreateTechStackDto } from '../tech-stacks/dto/create-tech-stack.dto';

@Injectable()
export class StudiesService {
  constructor(private readonly entityManager: EntityManager) {}

  private getTechStack() {
    return this.entityManager.find(TechStack);
  }

  // FIXME: 제네릭으로 시도 했지만 실패
  // private async techStack<T, U>(dto: T) {
  //   const allTechStacks = await this.getTechStack();
  //   if (!allTechStacks)
  //     throw new InternalServerErrorException(
  //       '서버 오류로 기술스택을 찾아오지 못했습니다. 다시 시도해주세요.',
  //     );
  //   const techStacks = dto.techStacks?.map((techStackDto: U) =>
  //     allTechStacks.find(
  //       (techStack: TechStack) => String(techStack.id) === techStackDto.id,
  //     ),
  //   );
  //   return techStacks;
  // }
  private async techStack(dto: CreateStudyDto | UpdateStudyDto) {
    const allTechStacks = await this.getTechStack();
    if (!allTechStacks)
      throw new InternalServerErrorException(
        '서버 오류로 기술스택을 찾아오지 못했습니다. 다시 시도해주세요.',
      );
    const techStacks = dto.techStacks?.map(
      (techStackDto: CreateTechStackDto | UpdateTechStackDto) =>
        allTechStacks.find(
          (techStack: TechStack) => String(techStack.id) === techStackDto.id,
        ),
    );
    return techStacks;
  }

  async createStudy(user: User, createStudyDto: CreateStudyDto) {
    const recruit = new Recruit({ ...createStudyDto.recruit });
    const allTechStacks = await this.getTechStack();
    if (!allTechStacks)
      throw new InternalServerErrorException(
        '서버 오류로 기술스택을 찾아오지 못했습니다. 다시 시도해주세요.',
      );
    const techStacks = await this.techStack(createStudyDto);
    const study = new Study({
      ...createStudyDto,
      recruit,
      techStacks,
      owner: user,
      participants: [user],
      bookmarkedUsers: null,
    });
    return this.entityManager.save(study);
  }

  private findStudyWithRelations(
    id: string,
    ...relationsArray: STUDY_RELATIONS[]
  ) {
    const relations = arrayToTrueObject(relationsArray);
    return this.entityManager.findOne(Study, {
      where: { id },
      relations,
    });
  }

  fetchAllStudies() {
    return this.entityManager.findAndCount(Study, {
      relations: arrayToTrueObject(Object.values(STUDY_RELATIONS)),
    });
  }

  fetchStudy(id: string) {
    return this.findStudyWithRelations(
      id,
      STUDY_RELATIONS.Owner,
      STUDY_RELATIONS.Inquiries,
      STUDY_RELATIONS.TechStacks,
      STUDY_RELATIONS.Participants,
    );
  }

  async updateStudy(id: string, user: User, updateStudyDto: UpdateStudyDto) {
    const targetStudy = await this.fetchStudy(id);
    if (!targetStudy)
      throw new BadRequestException('유효하지 않은 스터디 수정 요청입니다.');
    if (targetStudy.owner.id !== user.id)
      throw new UnauthorizedException('스터디 수정에 대한 권한이 없습니다.');
    const updatedStudy = Object.entries(updateStudyDto).reduce(
      (acc, [key, value]) => {
        return key && (acc = { ...acc, [key]: value });
      },
      targetStudy,
    );
    const techStacks = await this.techStack(updateStudyDto);
    updatedStudy.techStacks = techStacks;
    return this.entityManager.save(new Study(updatedStudy));
  }

  async softDeleteStudy(id: string, user: User) {
    const targetStudy = await this.entityManager.findOneBy(Study, { id });
    if (!targetStudy)
      throw new BadRequestException('유효하지 않은 스터디 삭제 요청입니다.');
    if (targetStudy.owner.id !== user.id)
      throw new UnauthorizedException('스터디 삭제에 대한 권한이 없습니다.');
    const deleteResult = await this.entityManager.softDelete(Study, { id });
    if (!deleteResult.affected)
      throw new InternalServerErrorException(
        '서버 오류로 스터디 삭제에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      status: HttpStatus.OK,
      message: '정상적으로 삭제되었습니다.',
    };
  }

  async restoreStudy(id: string, user: User) {
    const deletedStudy = await this.entityManager.findOne(Study, {
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    if (!deletedStudy)
      throw new BadRequestException('유효하지 않은 스터디 복구 요청입니다.');
    if (deletedStudy.owner.id !== user.id)
      throw new UnauthorizedException('스터디 복구에 대한 권한이 없습니다.');
    deletedStudy.deletedAt = null;
    const updateResult = await this.entityManager.save(deletedStudy);
    if (!updateResult)
      throw new InternalServerErrorException(
        '서버 오류로 스터디 복구에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      statusCode: HttpStatus.OK,
      message: `${id}/${deletedStudy.name} 스터디 복구에 성공했습니다.`,
    };
  }
}
