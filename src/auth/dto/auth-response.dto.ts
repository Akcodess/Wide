import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class AuthResponseDto {
  @ApiProperty({ example: 200 })
  @Expose()
  @Transform(({ value }) => value || 200)
  Status: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value || 'Success')
  Message: string;

  @ApiProperty()
  @Expose()
  UserId: string;

  @ApiProperty()
  @Expose()
  Roles: string[];

  @ApiProperty()
  @Expose()
  UserName: string;

  @ApiProperty()
  @Expose()
  TenantCode: string;

  @ApiProperty()
  @Expose()
  AccessToken: string;

  @ApiProperty()
  @Expose()
  ExpiresIn: string;

  @ApiProperty()
  @Expose()
  TimeStamp: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value || '')
  EvType: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value || '')
  EvCode: string;
}