import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Job } from './entities/job.entity';
import { DevCareer } from './entities/dev-career.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Job, DevCareer])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
