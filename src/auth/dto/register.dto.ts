import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty({ message: 'Tenant code cannot be empty.' })
  @IsString({ message: 'Tenant code must be a string.' })
  @Transform(({ value }) => value?.trim())
  tenantCode: string;

  @IsNotEmpty({ message: 'Auth code cannot be empty.' })
  @IsString({ message: 'Auth code must be a string.' })
  @Transform(({ value }) => value?.trim())
  authCode: string;

  @IsNotEmpty({ message: 'Role cannot be empty.' })
  @IsString({ message: 'Role must be a string.' })
  @Transform(({ value }) => value?.trim())
  role: string;
}