import { Expose, Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SettingEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/setting.enum';
import moment from 'moment';

export class UpdateSettingRequestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsArray()
  @IsNotEmpty()
  settingConfig: object;
}


export class UpdateSettingsResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus?.Ok)
  Status: number;

  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.SettingUpdated)
  Message: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @Expose()
  @Transform(({ value }) => value ?? SettingEvCode?.GetSettings)
  EvCode: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType: string;
}
