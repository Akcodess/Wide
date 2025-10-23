import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  tenantCode: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  authCode: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  role: string;
}