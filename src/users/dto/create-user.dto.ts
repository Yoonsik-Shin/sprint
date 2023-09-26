import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEmail,
  Matches,
  ValidateNested,
} from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';
import { CreateJobDto } from './create-job.dto';
import { CreateDevCareerDto } from './create-dev-career.dto';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: '이메일형식에 맞게 다시 입력해주세요.' })
  @Transform((params) => params.value.trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-z\d!@#$%^&*()]*$/, {
    message: '암호는 영문과 특수문자만 가능합니다!',
  })
  @Matches(/^[A-z\d!@#$%^&*()]{8,30}$/, {
    message: '암호는 최소 8자리 이상 30자 미만입니다!',
  })
  password: string;

  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;

  @ValidateNested()
  @Type(() => CreateJobDto)
  job: CreateJobDto;

  @ValidateNested()
  @Type(() => CreateDevCareerDto)
  devCareer: CreateDevCareerDto;
}
