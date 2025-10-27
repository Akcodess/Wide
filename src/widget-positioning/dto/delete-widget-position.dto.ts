import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import moment from 'moment';

import { WidgetPositioningEvCode, WidgetPositioningEvType, WidgetPositioningMessage, WidgetPositioningStatus } from '../constants/widget-positioning.enum';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteWidgetPositionRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    applicationCode: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    pageCode: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    widgetId: number;
}

export class DeleteWidgetPositionResponseDto {
    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningStatus?.Ok)
    Status: number;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningMessage?.WidgetPositionDeletedSuccessfully)
    Message: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvCode?.DeletePageWidgetPosition)
    EvCode: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvType?.Success)
    EvType: string;
}