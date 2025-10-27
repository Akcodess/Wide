import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { SettingEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/setting.enum';
import moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteSettingRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class DeleteSettingResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus?.Ok)
  Status: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.SettingDeleted)
  Message: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? SettingEvCode?.DeleteSetting)
  EvCode: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType: string;
}