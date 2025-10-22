import { Expose, Transform, Type } from 'class-transformer';
import { WidgetEvCode, WidgetEvType, WidgetStatus, WidgetMessage } from '../constants/widget.pagecode.enums';
import moment from 'moment';

export class WidgetItemDto {
  @Expose() WidgetId: number;
  @Expose() ApplicationCode: string;
  @Expose() WidgetName: string;
  @Expose() WidgetCode: string;
  @Expose() WidgetType: string;
  @Expose() WidgetConfig: any;
  @Expose() SourceData: any;
  @Expose() SourceType: string;
  @Expose() WidgetStyle: any;
  @Expose() HeaderStyle: any;
  @Expose() EntityState: number;
  @Expose() IsShow: number;
  @Expose() UserIds: string[];
  @Expose() PageCode: string;
}

export class GetWidgetByPageCodeResponseDto {
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus.Ok)
  Status: number;

  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage.RetrievedSuccessfully)
  Message: string;

  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType.Success)
  EvType: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.GetWidgetByPageCode)
  EvCode: string;

  @Expose()
  @Type(() => WidgetItemDto)
  Widgets: WidgetItemDto[];
}
