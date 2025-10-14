import { Expose, Transform } from 'class-transformer';
import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.enums';

export class UpdateWidgetResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus.Ok)
  Status: number;

  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage.WidgetUpdated)
  Message: string;

  @Expose()
  @Transform(({ value }) => value ?? new Date().toISOString().replace('T', ' ').substring(0, 19))
  TimeStamp: string;

  @Expose()
  data: { widgetId: number };

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.UpdateWidget)
  EvCode: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType.Success)
  EvType: string;
}


