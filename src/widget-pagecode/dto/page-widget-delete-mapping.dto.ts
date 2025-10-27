import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.pagecode.enums';
import moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

export class DeletePageWidgetMappingDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pageCode: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    widgetId: number;
}

export class CreatePageWidgetMappingResponseDto {
    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetStatus.Ok)
    Status: number;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetMessage?.PageWidgetMappingDeleted)
    Message: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetEvCode.DeletePageCodeWidgetMapping)
    EvCode: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetEvType.Success)
    EvType: string;
}