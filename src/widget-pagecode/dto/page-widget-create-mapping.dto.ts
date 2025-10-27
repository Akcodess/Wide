import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import moment from 'moment';

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.pagecode.enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePageWidgetMappingDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    widgetId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pageCode: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    applicationCode: string;
}

export class CreatePageWidgetMappingResponseDto {
    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetStatus.Ok)
    Status: number;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetMessage.PageWidgetMappingCreatedUpdated)
    Message: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetEvCode.CreatePageCodeWidgetMapping)
    EvCode: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetEvType.Success)
    EvType: string;
}
