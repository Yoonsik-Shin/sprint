import { Module } from '@nestjs/common';
import { StudiesService } from './studies.service';
import { StudiesController } from './studies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StudyMember, StudyMemberSchema } from '../mongo/schemas';
import {
  StudyRequestStatus,
  StudyRequestStatusSchema,
} from '../mongo/schemas/study-request-status';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudyMember.name, schema: StudyMemberSchema },
      { name: StudyRequestStatus.name, schema: StudyRequestStatusSchema },
    ]),
  ],
  controllers: [StudiesController],
  providers: [StudiesService],
})
export class StudiesModule {}
