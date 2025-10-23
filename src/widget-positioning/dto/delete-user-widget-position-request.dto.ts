import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { WidgetPositioningEvCode, WidgetPositioningEvType, WidgetPositioningMessage, WidgetPositioningStatus } from '../constants/widget-positioning.enum';
import moment from 'moment';

export class DeleteUserWidgetPositionRequestDto {
  @IsNotEmpty()
  @IsNumber()
  widgetId: number;

  @IsNotEmpty()
  @IsString()
  applicationCode: string;

  @IsNumber()
  userId?: number;
}

export class DeleteUserWidgetPositionResponseDto {
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningStatus?.Ok)
    Status: number;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningMessage?.UserWidgetPositionDeletedSuccessfully)
    Message: string;

    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvCode?.DeleteUserWidgetPosition)
    EvCode: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvType?.Success)
    EvType: string;
}