import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.enums';

export class WidgetByUserIdDto {
  @Expose()
  WidgetId: number;

  @Expose()
  ApplicationCode: string;

  @Expose()
  WidgetName: string;

  @Expose()
  WidgetCode: string;

  @Expose()
  WidgetType: string;

  @Expose()
  SourceData: string;

  @Expose()
  SourceType: string;

  @Expose()
  WidgetConfig: string;

  @Expose()
  UserIds: number[];

  @Expose()
  PageCode: string;
}

export class GetWidgetsByUserIdResponseDto  {
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
    @Type(() => WidgetByUserIdDto)
    WidgetList: WidgetByUserIdDto[];
  
    @Expose()
    @Transform(({ value }) => value ?? WidgetEvType.Success)
    EvType: string;
  
    @Expose()
    @Transform(({ value }) => value ?? WidgetEvCode.GetWidget)
    EvCode: string;
}