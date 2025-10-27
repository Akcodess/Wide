import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

import { SettingEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/setting.enum';

export class GetSettingsRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicationCode?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pageCode?: string;
}

export class SettingList {
  @ApiProperty() @Expose() Id: number;
  @ApiProperty() @Expose() PageCode: string;
  @ApiProperty() @Expose() SettingConfig: string;
  @ApiProperty() @Expose() ApplicationCode: string;
  @ApiProperty() @Expose() CreatedOn: Date;
  @ApiProperty() @Expose() CreatedBy: number;
  @ApiProperty() @Expose() EditedOn: Date;
  @ApiProperty() @Expose() EditedBy: number;
  @ApiProperty() @Expose() EntityState: number;
}

export class GetSettingsResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus?.Ok)
  Status: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.SettingsFetched)
  Message: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @ApiProperty()
  @Expose()
  @Type(() => SettingList)
  SettingList: SettingList[];

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? SettingEvCode?.GetSettings)
  EvCode: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType: string;
}