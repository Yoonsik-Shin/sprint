import { IsOptional, IsString } from 'class-validator';

export class EmailTokenDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  @IsOptional()
  token?: string;
}
