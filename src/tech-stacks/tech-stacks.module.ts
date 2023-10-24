import { Module } from '@nestjs/common';
import { TechStacksService } from './tech-stacks.service';
import { TechStacksController } from './tech-stacks.controller';

@Module({
  controllers: [TechStacksController],
  providers: [TechStacksService],
  exports: [TechStacksService],
})
export class TechStacksModule {}
