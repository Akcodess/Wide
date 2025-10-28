import { Expose, Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import moment from 'moment';

import { WidgetMessage, WidgetStatus, WidgetEvType, WidgetEvCode } from '../constants/widget.enums';

export class WidgetItemDto {
  @ApiProperty() @Expose() Id: number;
  @ApiProperty() @Expose() ApplicationCode: string;
  @ApiProperty() @Expose() WidgetName: string;
  @ApiProperty() @Expose() WidgetCode: string;
  @ApiProperty() @Expose() WidgetType: string;
  @ApiProperty() @Expose() SourceData: string;
  @ApiProperty() @Expose() SourceType: string;
  @ApiProperty() @Expose() WidgetStyle: string;
  @ApiProperty() @Expose() HeaderStyle: string;
  @ApiProperty() @Expose() EntityState: number;
  @ApiProperty() @Expose() IsShow: number;
  @ApiProperty() @Expose() PageCode: string;
  @ApiProperty() @Expose() WidgetId: number;
  @ApiProperty() @Expose() WidgetConfig: string;
  @ApiProperty() @Expose() UserIds: any[];
}

export class GetWidgetsResponseDto {
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
  @Type(() => WidgetItemDto)
  WidgetList: WidgetItemDto[];

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType.Success)
  EvType: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.GetWidget)
  EvCode: string;
}
