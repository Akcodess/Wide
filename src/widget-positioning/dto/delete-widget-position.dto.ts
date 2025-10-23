import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import moment from 'moment';

import { WidgetPositioningEvCode, WidgetPositioningEvType, WidgetPositioningMessage, WidgetPositioningStatus } from '../constants/widget-positioning.enum';

export class DeleteWidgetPositionRequestDto {
    @IsNotEmpty()
    @IsString()
    applicationCode: string;

    @IsNotEmpty()
    @IsString()
    pageCode: string;

    @IsNotEmpty()
    @IsNumber()
    widgetId: number;
}

export class DeleteWidgetPositionResponseDto {
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningStatus?.Ok)
    Status: number;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningMessage?.WidgetPositionDeletedSuccessfully)
    Message: string;

    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvCode?.DeletePageWidgetPosition)
    EvCode: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvType?.Success)
    EvType: string;
}