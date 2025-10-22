import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.pagecode.enums';
import moment from 'moment';

export class DeletePageWidgetMappingDto {
    @IsString()
    @IsNotEmpty()
    pageCode: string;

    @IsNumber()
    @IsNotEmpty()
    widgetId: number;
}

export class CreatePageWidgetMappingResponseDto {
    @Expose()
    @Transform(({ value }) => value ?? WidgetStatus.Ok)
    Status: number;

    @Expose()
    @Transform(({ value }) => value ?? WidgetMessage?.PageWidgetMappingDeleted)
    Message: string;

    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetEvCode.DeletePageCodeWidgetMapping)
    EvCode: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetEvType.Success)
    EvType: string;
}