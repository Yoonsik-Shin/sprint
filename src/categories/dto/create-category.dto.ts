import { IsOptional, IsString } from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';

export class CreateCategoryDto extends SuperCreateDto {
  @IsOptional()
  @IsString()
  category: string;
}
