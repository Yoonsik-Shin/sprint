import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';
import { CreateRecruitDto } from './create-recruit.dto';
import { Type } from 'class-transformer';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CreateTechStackDto } from '../../tech-stacks/dto/create-tech-stack.dto';

export class CreateStudyDto extends SuperCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  @IsNotEmpty()
  attendantsLimit: number;

  // @IsDate()
  // @IsNotEmpty()
  @IsOptional()
  startDate?: Date;

  // @IsDate()
  // @IsNotEmpty()
  @IsOptional()
  endDate?: Date;

  @ValidateNested()
  @Type(() => CreateRecruitDto)
  recruit?: CreateRecruitDto;

  @ValidateNested()
  @Type(() => CreateUserDto)
  @IsOptional()
  owner?: CreateUserDto;

  @ValidateNested()
  @Type(() => CreateTechStackDto)
  @IsOptional()
  techStacks?: CreateTechStackDto[];

  @ValidateNested()
  @Type(() => CreateUserDto)
  @IsOptional()
  participants?: CreateUserDto[];

  @ValidateNested()
  @Type(() => CreateUserDto)
  @IsOptional()
  bookmarkedUsers?: CreateUserDto[];
}
