import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.enums';
import { ApiProperty } from '@nestjs/swagger';

export class WidgetByUserIdDto {
  @ApiProperty()
  @Expose()
  WidgetId: number;

  @ApiProperty()
  @Expose()
  ApplicationCode: string;

  @ApiProperty()
  @Expose()
  WidgetName: string;

  @ApiProperty()
  @Expose()
  WidgetCode: string;

  @ApiProperty()
  @Expose()
  WidgetType: string;

  @ApiProperty()
  @Expose()
  SourceData: string;

  @ApiProperty()
  @Expose()
  SourceType: string;

  @ApiProperty()
  @Expose()
  WidgetConfig: string;

  @ApiProperty()
  @Expose()
  UserIds: number[];

  @ApiProperty()
  @Expose()
  PageCode: string;
}

export class GetWidgetsByUserIdResponseDto {
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
  @Type(() => WidgetByUserIdDto)
  WidgetList: WidgetByUserIdDto[];

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType.Success)
  EvType: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.GetWidget)
  EvCode: string;
}