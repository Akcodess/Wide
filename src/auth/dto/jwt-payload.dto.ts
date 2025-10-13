import { Expose, Transform } from 'class-transformer';

export class JwtPayloadDto {
  @Expose()
  @Transform(({ value }) => value || '')
  userId: string;

  @Expose()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  roles: string[];

  @Expose()
  @Transform(({ value }) => value || '')
  userName: string;

  @Expose()
  @Transform(({ value }) => value || '')
  tenantCode: string;
}