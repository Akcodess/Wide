import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  tenantCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  authCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  role: string;
}