import { Expose, Transform, Type } from 'class-transformer';
import { WidgetEvCode, WidgetEvType, WidgetStatus, WidgetMessage } from '../constants/widget.pagecode.enums';

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
  @Transform(({ value }) => value ?? new Date().toISOString().replace('T', ' ').substring(0, 19))
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
