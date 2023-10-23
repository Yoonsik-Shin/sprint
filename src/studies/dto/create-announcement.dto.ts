import { IsString } from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';

export class CreateAnnouncementDto extends SuperCreateDto {
  @IsString()
  contents: string;
}
