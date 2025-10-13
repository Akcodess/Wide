import { Expose, Transform, Type } from 'class-transformer';
import { WidgetMessage, WidgetStatus, WidgetEvType, WidgetEvCode } from '../constants/widget.enums';

export class WidgetItemDto {
  @Expose() Id: number;
  @Expose() ApplicationCode: string;
  @Expose() WidgetName: string;
  @Expose() WidgetCode: string;
  @Expose() WidgetType: string;
  @Expose() SourceData: string;
  @Expose() SourceType: string;
  @Expose() WidgetStyle: string;
  @Expose() HeaderStyle: string;
  @Expose() EntityState: number;
  @Expose() IsShow: number;
  @Expose() PageCode: string;
  @Expose() WidgetId: number;
  @Expose() WidgetConfig: string;
  @Expose() UserIds: any[];
}

export class GetWidgetsResponseDto {
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
  @Type(() => WidgetItemDto)
  WidgetList: WidgetItemDto[];

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType.Success)
  EvType: string;

  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.GetWidget)
  EvCode: string;
}
