import { IsString, IsOptional } from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';

export class CreateDevCareerDto extends SuperCreateDto {
  @IsOptional()
  @IsString()
  devCareer: string;
}
