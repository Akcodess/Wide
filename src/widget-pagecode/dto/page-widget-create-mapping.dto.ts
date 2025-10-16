import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.pagecode.enums';

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
    @Transform(({ value }) => value ?? new Date().toISOString().replace('T', ' ').substring(0, 19))
    TimeStamp: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetEvCode.CreatePageCodeWidgetMapping)
    EvCode: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetEvType.Success)
    EvType: string;
}
