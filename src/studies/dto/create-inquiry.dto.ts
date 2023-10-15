import { IsString } from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';

export class CreateInquiryDto extends SuperCreateDto {
  @IsString()
  title: string;

  @IsString()
  contents: string;
}
