import { IsString } from 'class-validator';
import { SuperCreateDto } from '../../commons/dto/super-create.dto';

export class CreateTechStack extends SuperCreateDto {
  @IsString()
  stackName: string;
}
