import moment from 'moment';
import { Widget } from '../widget.entity';
import { Expose, Transform, Type } from 'class-transformer';
import { WidgetEvCode, WidgetEvType, WidgetMessage } from '../constants/widget.enums';

export class GetWidgetByCodeResponseDto {
  @Expose()
  Status!: number;

  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.WidgetFoundByCode)
  Message!: string;

  @Expose()
  @Type(() => Object)
  Widget!: Widget | null;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.GetWidgetByCode)
  EvCode!: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType!: string;
}
