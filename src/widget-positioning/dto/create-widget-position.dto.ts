import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { WidgetPositioningEvCode, WidgetPositioningEvType, WidgetPositioningMessage, WidgetPositioningStatus } from '../constants/widget-positioning.enum';

class PositionItemDto {
    @IsNumber()
    x: number;

    @IsNumber()
    y: number;

    @IsNumber()
    w: number;

    @IsNumber()
    h: number;

    @IsNumber()
    i: number;
}

export class CreateWidgetPositionRequestDto {
    @IsString()
    applicationCode: string;

    @IsString()
    pageCode: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PositionItemDto)
    position: PositionItemDto[];
}

export class CreateWidgetPositionResponseDto {
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningStatus?.Ok)
    Status: number;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningMessage?.WidgetPositionCreated)
    Message: string;

    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvCode?.CreateWidgetPosition)
    EvCode: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvType?.Success)
    EvType: string;
}
