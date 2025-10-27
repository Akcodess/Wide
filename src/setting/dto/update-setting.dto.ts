import { Expose, Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { SettingEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/setting.enum';
import moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  settingConfig: object;
}


export class UpdateSettingsResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus?.Ok)
  Status: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.SettingUpdated)
  Message: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? SettingEvCode?.GetSettings)
  EvCode: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType: string;
}
