import { PartialType } from '@nestjs/mapped-types';
import { CreateRecruitDto } from './create-recruit.dto';

export class UpdateRecruitDto extends PartialType(CreateRecruitDto) {}
