import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { SettingEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/setting.enum';
import moment from 'moment';

export class DeleteSettingRequestDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class DeleteSettingResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus?.Ok)
  Status: number;

  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.SettingDeleted)
  Message: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @Expose()
  @Transform(({ value }) => value ?? SettingEvCode?.DeleteSetting)
  EvCode: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType: string;
}