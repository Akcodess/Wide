import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.pagecode.enums';
import moment from 'moment';

export class CreatePageWidgetMappingDto {
    @IsNumber()
    @IsNotEmpty()
    widgetId: number;

    @IsString()
    @IsNotEmpty()
    pageCode: string;

    @IsString()
    @IsNotEmpty()
    applicationCode: string;
}

export class CreatePageWidgetMappingResponseDto {
    @Expose()
    @Transform(({ value }) => value ?? WidgetStatus.Ok)
    Status: number;

    @Expose()
    @Transform(({ value }) => value ?? WidgetMessage.PageWidgetMappingCreatedUpdated)
    Message: string;

    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetEvCode.CreatePageCodeWidgetMapping)
    EvCode: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetEvType.Success)
    EvType: string;
}
