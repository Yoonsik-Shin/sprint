import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Job } from '../categories/entities/job.entity';
import { DevCareer } from '../categories/entities/dev-career.entity';
import { Study } from '../studies/entities/study.entity';
import { Recruit } from '../studies/entities/recruit.entity';
import { TechStack } from '../tech-stacks/entities/tech-stack.entity';
import { Inquiry } from '../studies/entities/Inquiry.entity';
import { EmailService } from '../email/email.service';
import { FilesModule } from '../files/files.module';

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
    ]),
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
  exports: [UsersService],
})
export class UsersModule {}
