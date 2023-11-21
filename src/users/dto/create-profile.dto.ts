import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  profileImg: string;

  @IsOptional()
  @IsBoolean()
  gender: boolean;
}
