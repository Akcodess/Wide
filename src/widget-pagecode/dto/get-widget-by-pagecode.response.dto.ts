import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

import { WidgetEvCode, WidgetEvType, WidgetStatus, WidgetMessage } from '../constants/widget.pagecode.enums';

export class WidgetItemDto {
  @ApiProperty() @Expose() WidgetId: number;
  @ApiProperty() @Expose() ApplicationCode: string;
  @ApiProperty() @Expose() WidgetName: string;
  @ApiProperty() @Expose() WidgetCode: string;
  @ApiProperty() @Expose() WidgetType: string;
  @ApiProperty() @Expose() WidgetConfig: any;
  @ApiProperty() @Expose() SourceData: any;
  @ApiProperty() @Expose() SourceType: string;
  @ApiProperty() @Expose() WidgetStyle: any;
  @ApiProperty() @Expose() HeaderStyle: any;
  @ApiProperty() @Expose() EntityState: number;
  @ApiProperty() @Expose() IsShow: number;
  @ApiProperty() @Expose() UserIds: string[];
  @ApiProperty() @Expose() PageCode: string;
}

export class GetWidgetByPageCodeResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus.Ok)
  Status: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage.RetrievedSuccessfully)
  Message: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType.Success)
  EvType: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.GetWidgetByPageCode)
  EvCode: string;

  @ApiProperty()
  @Expose()
  @Type(() => WidgetItemDto)
  Widgets: WidgetItemDto[];
}
