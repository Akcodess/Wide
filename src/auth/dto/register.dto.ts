import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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