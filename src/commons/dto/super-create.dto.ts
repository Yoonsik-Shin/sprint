import { IsString, IsOptional } from 'class-validator';

export class SuperCreateDto {
  @IsString()
  @IsOptional()
  id: string;
}
