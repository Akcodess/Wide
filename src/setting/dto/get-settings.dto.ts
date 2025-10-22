import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/setting.enum';

export class GetSettingsRequestDto {
  @IsString()
  @IsNotEmpty()
  applicationCode?: string;

  @IsString()
  @IsNotEmpty()
  pageCode?: string;
}

export class SettingList {
  @Expose() Id: number;
  @Expose() PageCode: string;
  @Expose() SettingConfig: string;
  @Expose() ApplicationCode: string;
  @Expose() CreatedOn: Date;
  @Expose() CreatedBy: number;
  @Expose() EditedOn: Date;
  @Expose() EditedBy: number;
  @Expose() EntityState: number;
}

export class GetSettingsResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus.Ok)
  Status: number;

  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.PageWidgetMappingDeleted)
  Message: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @Expose()
  @Type(() => SettingList)
  SettingList: SettingList[];

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.GetSettings)
  EvCode: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType.Success)
  EvType: string;
}