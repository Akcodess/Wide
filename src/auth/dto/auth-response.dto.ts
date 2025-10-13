import { Expose, Transform } from 'class-transformer';

export class AuthResponseDto {
  @Expose()
  @Transform(({ value }) => value || 200)
  Status: number;

  @Expose()
  @Transform(({ value }) => value || 'Success')
  Message: string;

  @Expose()
  UserId: string;

  @Expose()
  Roles: string[];

  @Expose()
  UserName: string;

  @Expose()
  TenantCode: string;

  @Expose()
  AccessToken: string;

  @Expose()
  ExpiresIn: string;

  @Expose()
  TimeStamp: string;

  @Expose()
  @Transform(({ value }) => value || '')
  EvType: string;

  @Expose()
  @Transform(({ value }) => value || '')
  EvCode: string;
}