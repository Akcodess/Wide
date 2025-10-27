import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { WidgetPositioningEvCode, WidgetPositioningEvType, WidgetPositioningMessage, WidgetPositioningStatus } from '../constants/widget-positioning.enum';
import { ApiProperty } from '@nestjs/swagger';

class PositionItemDto {
    @ApiProperty()
    @IsNumber()
    x: number;

    @ApiProperty()
    @IsNumber()
    y: number;

    @ApiProperty()
    @IsNumber()
    w: number;

    @ApiProperty()
    @IsNumber()
    h: number;

    @ApiProperty()
    @IsNumber()
    i: number;
}

export class CreateWidgetPositionRequestDto {
    @ApiProperty()
    @IsString()
    applicationCode: string;

    @ApiProperty()
    @IsString()
    pageCode: string;

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PositionItemDto)
    position: PositionItemDto[];
}

export class CreateWidgetPositionResponseDto {
    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningStatus?.Ok)
    Status: number;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningMessage?.WidgetPositionCreated)
    Message: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvCode?.CreateWidgetPosition)
    EvCode: string;

    @ApiProperty()
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvType?.Success)
    EvType: string;
}
