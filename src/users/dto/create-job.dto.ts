import { IsString, IsOptional } from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';

export class CreateJobDto extends SuperCreateDto {
  @IsOptional()
  @IsString()
  job: string;
}
