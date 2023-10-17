import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';

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
