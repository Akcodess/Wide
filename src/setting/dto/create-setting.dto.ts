import { Expose, Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';

import { SettingEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/setting.enum';

export class CreateSettingRequestDto {
  @IsString()
  @IsNotEmpty()
  applicationCode: string;

  @IsString()
  @IsNotEmpty()
  pageCode: string;

  @IsArray()
  @IsNotEmpty()
  settingConfig: string[];
}

export class CreateSettingsResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus?.Ok)
  Status: number;

  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.SettingCreated)
  Message: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @Expose()
  @Transform(({ value }) => value ?? SettingEvCode?.CreateSetting)
  EvCode: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType: string;
}