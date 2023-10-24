import { TechStacksService } from './../tech-stacks/tech-stacks.service';
import { Inquiry } from './entities/inquiry.entity';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { EntityManager, IsNull, Not } from 'typeorm';
import { CreateStudyDto } from './dto/create-study.dto';
import { User } from '../users/entities/user.entity';
import { Study } from './entities/study.entity';
import { Recruit } from './entities/recruit.entity';
import { UpdateStudyDto } from './dto/update-study.dto';
import { arrayToTrueObject } from '../commons/utils/arrayToTrueObject';
import { STUDY_RELATIONS } from './enum/study.enum';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { StudyMember } from '../mongo/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StudyRequestStatus } from '../mongo/schemas/study-request-status';
import { CreateInquiryResponseDto } from './dto/create-inquiry-response.dto';
import { InquiryResponse } from './entities/inquiry-response.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { Announcement } from './entities/announcement.enitity';

@Injectable()
export class StudiesService {
  constructor(
    @InjectModel(StudyMember.name)
    private readonly studyMemberModel: Model<StudyMember>,
    @InjectModel(StudyRequestStatus.name)
    private readonly StudyRequestStatusModel: Model<StudyRequestStatus>,
    private readonly entityManager: EntityManager,
    private readonly techStacksService: TechStacksService,
  ) {}

  async createStudy(user: User, createStudyDto: CreateStudyDto) {
    const recruit = new Recruit({ ...createStudyDto.recruit });
    const allTechStacks = await this.techStacksService.getTechStack();
    if (!allTechStacks)
      throw new InternalServerErrorException(
        '서버 오류로 기술스택을 찾아오지 못했습니다. 다시 시도해주세요.',
      );
    const techStacks = await this.techStacksService.techStack(createStudyDto);
    // FIXME: 리팩토링 필요
    delete user.password;
    delete user.createdAt;
    delete user.deletedAt;
    delete user.updatedAt;
    delete user.emailVerified;
    delete user.ownedStudies;
    delete user.bookmarkedStudies;
    delete user.participatingStudies;
    delete user.inquiries;
    delete user.profile.createdAt;
    delete user.profile.deletedAt;
    delete user.profile.updatedAt;

    const study = new Study({
      ...createStudyDto,
      recruit,
      techStacks,
      owner: user,
      participants: [user],
      bookmarkedUsers: null,
    });
    delete study.bookmarkedUsers;

    const restoredStudy = await this.entityManager.save(study);

    // mongoDB에 스터디원 정보저장
    this.studyMemberModel.create({
      userId: user.id,
      studyId: restoredStudy.id,
      status: 'false',
    });

    return restoredStudy;
  }

  findStudyWithRelations(id: number, ...relationsArray: STUDY_RELATIONS[]) {
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

  async fetchStudiesWithOffset(offset: number, limit: number, filter: string) {
    const otherOptions: OffsetFindOptions = {
      skip: offset,
      take: limit,
      relations: arrayToTrueObject(Object.values(STUDY_RELATIONS)),
      order: { id: 'DESC' },
    };

    if (filter) {
      const techStackIds = filter.split(',');
      const where = techStackIds.map((techStackId) => ({
        techStacks: { id: Number(techStackId) },
      }));
      return this.entityManager.findAndCount(Study, { where, ...otherOptions });
    }

    return this.entityManager.findAndCount(Study, { ...otherOptions });
  }

  fetchStudy(id: number) {
    return this.findStudyWithRelations(
      id,
      STUDY_RELATIONS.Owner,
      STUDY_RELATIONS.Inquiries,
      STUDY_RELATIONS.TechStacks,
      STUDY_RELATIONS.Participants,
      STUDY_RELATIONS.Recruit,
    );
  }

  async updateStudy(id: number, user: User, updateStudyDto: UpdateStudyDto) {
    const targetStudy = await this.fetchStudy(id);
    if (!targetStudy)
      throw new BadRequestException('유효하지 않은 스터디 수정 요청입니다.');
    if (targetStudy.owner.id !== user.id)
      throw new UnauthorizedException('스터디 수정에 대한 권한이 없습니다.');
    const updatedStudy = Object.entries(updateStudyDto).reduce(
      (acc, [key, value]) => {
        return key && { ...acc, [key]: value };
      },
      targetStudy,
    );
    const techStacks = await this.techStacksService.techStack(updateStudyDto);
    updatedStudy.techStacks = techStacks;
    return this.entityManager.save(new Study(updatedStudy));
  }

  async softDeleteStudy(id: number, user: User) {
    const targetStudy = await this.findStudyWithRelations(
      id,
      STUDY_RELATIONS.Owner,
    );
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

  async restoreStudy(id: number, user: User) {
    const deletedStudy = await this.entityManager.findOne(Study, {
      where: { id, deletedAt: Not(IsNull()) },
      withDeleted: true,
      relations: { owner: true },
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

  async createAnnouncement(
    studyId: number,
    user: User,
    createAnnouncementDto: CreateAnnouncementDto,
  ) {
    const study = await this.fetchStudy(studyId);
    if (study.owner.id !== user.id)
      throw new UnauthorizedException('공지를 생성할 수 있는 권한이 없습니다.');
    const announcement = new Announcement({
      ...createAnnouncementDto,
      user,
      study,
    });
    return this.entityManager.save(announcement);
  }

  async fetchStudyAnnouncementAll(studyId: number) {
    const study = await this.entityManager.findOne(Study, {
      where: { id: studyId },
      relations: { announcements: true },
    });
    const [latestAnnouncement, ...rest] = study.announcements.reverse();
    return latestAnnouncement;
  }

  async fetchOneAnnouncement(studyId: number, announcementId: number) {
    const study = await this.entityManager.findOne(Study, {
      where: { id: studyId },
      relations: { announcements: true },
    });
    const announcement = study.announcements.find(
      (announcement) => announcement.id === announcementId,
    );
    if (!announcement)
      throw new BadRequestException('해당하는 공지사항이 존재하지 않습니다.');
    return announcement;
  }

  async updateAnnouncement(
    studyId: number,
    announcementId: number,
    user: User,
    createAnnouncementDto: CreateAnnouncementDto,
  ) {
    const { contents } = createAnnouncementDto;
    const study = await this.fetchStudy(studyId);
    if (study.owner.id !== user.id)
      throw new UnauthorizedException('공지를 수정할 수 있는 권한이 없습니다.');
    const prevAnnouncement = await this.fetchOneAnnouncement(
      studyId,
      announcementId,
    );
    prevAnnouncement.contents = contents;
    return this.entityManager.save(prevAnnouncement);
  }

  deleteAnnouncement() {}

  async bookmarkStudy(studyId: number, user: User) {
    const study = await this.findStudyWithRelations(
      studyId,
      STUDY_RELATIONS.TechStacks,
      STUDY_RELATIONS.Recruit,
    );
    const bookmarkedStudy = user.bookmarkedStudies.find(
      (bookmarkStudy) => bookmarkStudy.id === studyId,
    );
    !bookmarkedStudy && user.bookmarkedStudies.push(study);
    bookmarkedStudy &&
      (user.bookmarkedStudies = user.bookmarkedStudies.filter(
        (bookmarkStudy) => bookmarkStudy.id !== studyId,
      ));
    return this.entityManager.save(user);
  }

  async checkStudyAttendRequest(id: number, user: User) {
    const isRequested = await this.StudyRequestStatusModel.find().where({
      studyId: id,
      userId: user.id,
    });
    if (isRequested.length >= 1)
      throw new BadRequestException('이미 신청 요청이 되어있는 스터디입니다.');
    return true;
  }

  async acceptStudyAttend(fromUser: User, studyId: number) {
    const study = await this.findStudyWithRelations(
      studyId,
      STUDY_RELATIONS.Participants,
    );
    const user = await this.entityManager.findOne(User, {
      where: { id: fromUser.id },
      relations: { participatingStudies: true },
    });
    const isRequested = await this.StudyRequestStatusModel.deleteOne({
      studyId: study.id,
      userId: user.id,
    });
    if (isRequested)
      throw new InternalServerErrorException(
        '서버 오류로 정상적으로 처리되지 못했습니다.',
      );

    user.participatingStudies.push(study);
    return this.entityManager.save(user);
  }

  async closeStudyRecruit(id: number, user: User) {
    const study = await this.findStudyWithRelations(
      id,
      STUDY_RELATIONS.Owner,
      STUDY_RELATIONS.Recruit,
    );
    if (user.id !== study.owner.id)
      throw new UnauthorizedException(
        '스터디 모집 종료에 대한 권한이 없습니다.',
      );
    study.recruit.isRecruit = false;
    const isSuccess = await this.entityManager.save(study);
    if (!isSuccess)
      throw new InternalServerErrorException(
        '서버 오류로 모집종료 업데이트에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 모집종료 되었습니다.',
    };
  }

  async createStudyInquiry(
    createInquiryDto: CreateInquiryDto,
    studyId: number,
    user: User,
  ) {
    const study = await this.findStudyWithRelations(studyId);
    const inquiry = new Inquiry({ ...createInquiryDto, study, user });
    const isSuccess = await this.entityManager.save(inquiry);
    if (!isSuccess)
      throw new InternalServerErrorException(
        '서버 오류로 질의 업데이트에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 등록 되었습니다.',
    };
  }

  async fetchOneStudyInquires(studyId: number) {
    const study = await this.findStudyWithRelations(
      studyId,
      STUDY_RELATIONS.Inquiries,
    );
    return study.inquiries;
  }

  async responseStudyInquiry(
    createInquiryResponseDto: CreateInquiryResponseDto,
    inquiryId: number,
  ) {
    const inquiry = await this.entityManager.findOne(Inquiry, {
      where: { id: inquiryId },
    });
    const inquiryResponse = new InquiryResponse({
      ...createInquiryResponseDto,
    });
    inquiry.inquiryResponse = inquiryResponse;
    return this.entityManager.save(inquiry);
  }

  async updateStudyInquiry(
    studyId: number,
    inquiryId: number,
    updateInquiryDto: UpdateStudyDto,
  ) {
    const prevInquiry = await this.fetchOneStudyInquiry(studyId, inquiryId);
    const inquiry = new Inquiry({ ...prevInquiry, ...updateInquiryDto });
    return this.entityManager.save(inquiry);
  }

  async deleteStudyInquiry(studyId: number, inquiryId: number, user: User) {
    const inquiry = await this.entityManager.findOne(Inquiry, {
      where: { id: inquiryId },
    });
    if (!inquiry)
      throw new BadRequestException('삭제하려는 질의가 존재하지 않습니다.');
    const isExist = user.inquiries.find((userInquiry) => {
      userInquiry.id === inquiry.id;
    });
    if (!isExist)
      throw new UnauthorizedException('질의 삭제에 대한 권한이 없습니다.');
    const isDeleted = await this.entityManager.softDelete(Inquiry, {
      where: { id: inquiryId },
    });
    if (!isDeleted.affected)
      throw new InternalServerErrorException(
        '서버 오류로 질의 삭제에 실패했습니다. 다시 시도해주세요.',
      );
    return {
      statusCode: HttpStatus.OK,
      message: '성공적으로 삭제 되었습니다.',
    };
  }

  fetchStudyInquiriesAll() {
    return this.entityManager.find(Inquiry);
  }

  async fetchOneStudyInquiry(studyId: number, inquiryId: number) {
    const study = await this.findStudyWithRelations(
      studyId,
      STUDY_RELATIONS.Inquiries,
    );
    const targetInquiry = study.inquiries.find(
      (inquiry) => inquiry.id === inquiryId,
    );
    return targetInquiry;
  }
}

type OffsetFindOptions = {
  skip: number;
  take: number;
  relations: {};
  order: {};
};
