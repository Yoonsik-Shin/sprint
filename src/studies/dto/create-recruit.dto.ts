import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';

export class CreateRecruitDto extends SuperCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  isRecruit: boolean;

  @IsString()
  recruitPlaceholder: string;
}
