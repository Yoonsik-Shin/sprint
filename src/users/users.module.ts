import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Profile, User } from './entities';
import { DevCareer, Job } from '../categories';
import { TechStack, TechStacksModule } from '../tech-stacks';
import {
  Announcement,
  Inquiry,
  InquiryResponse,
  Recruit,
  Study,
} from '../studies';
import { FilesModule } from '../files';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      Job,
      DevCareer,
      Study,
      Recruit,
      TechStack,
      Inquiry,
      InquiryResponse,
      Announcement,
    ]),
    FilesModule,
    TechStacksModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
