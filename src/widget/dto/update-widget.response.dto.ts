import { Expose, Transform } from 'class-transformer';
import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.enums';
import moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWidgetResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus.Ok)
  Status: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage.WidgetUpdated)
  Message: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @ApiProperty()
  @Expose()
  data: { widgetId: number };

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.UpdateWidget)
  EvCode: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType.Success)
  EvType: string;
}


