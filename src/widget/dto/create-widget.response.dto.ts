import { Expose, Transform } from 'class-transformer';
import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.enums';
import moment from 'moment';

export class CreateWidgetResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus.Ok)
  Status: number;

  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage.AddedSuccessfully)
  Message: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @Expose()
  data: { widgetId: number };

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.AddWidget)
  EvCode: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType.Success)
  EvType: string;
}
