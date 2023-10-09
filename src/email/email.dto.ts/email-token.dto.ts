import { IsOptional, IsString } from 'class-validator';

export class EmailTokenDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  token: string;
}
