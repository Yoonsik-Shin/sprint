import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevCareer } from './entities/dev-career.entity';
import { Job } from './entities/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, DevCareer])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
