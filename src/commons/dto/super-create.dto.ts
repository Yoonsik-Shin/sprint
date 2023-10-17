import { IsOptional, IsNumber } from 'class-validator';

export class SuperCreateDto {
  @IsNumber()
  @IsOptional()
  id: number;
}
