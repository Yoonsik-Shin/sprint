import { IsOptional, IsString } from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';

export class CreateTechStackDto extends SuperCreateDto {
  @IsString()
  @IsOptional()
  stackName?: string;

  @IsString()
  @IsOptional()
  stackImg?: string;
}
