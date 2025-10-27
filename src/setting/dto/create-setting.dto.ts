import { Expose, Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

import { SettingEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/setting.enum';

export class CreateSettingRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicationCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pageCode: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  settingConfig: string[];
}

export class CreateSettingsResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus?.Ok)
  Status: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.SettingCreated)
  Message: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? SettingEvCode?.CreateSetting)
  EvCode: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType: string;
}