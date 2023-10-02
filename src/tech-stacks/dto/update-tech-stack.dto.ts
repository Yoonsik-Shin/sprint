import { PartialType } from '@nestjs/mapped-types';
import { CreateTechStack } from './create-tech-stack.dto';

export class UpdateTechStackDto extends PartialType(CreateTechStack) {}
