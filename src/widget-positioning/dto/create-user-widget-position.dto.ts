import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import moment from 'moment';

import { WidgetPositioningEvCode, WidgetPositioningEvType, WidgetPositioningMessage, WidgetPositioningStatus } from '../constants/widget-positioning.enum';

class UserWidgetPositionItem {
  @IsNumber()
  i: number;

  @IsNumber()
  @IsOptional()
  x?: number;

  @IsNumber()
  @IsOptional()
  y?: number;

  @IsNumber()
  @IsOptional()
  w?: number;

  @IsNumber()
  @IsOptional()
  h?: number;
}

export class CreateUserWidgetPositionRequestDto {
  @IsString()
  @IsNotEmpty()
  applicationCode: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserWidgetPositionItem)
  position: UserWidgetPositionItem[];
}

export class CreateUserWidgetPositionResponseDto {
    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningStatus?.Ok)
    Status: number;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningMessage?.UserWidgetPositionsCreatedUpdatedSuccessfully)
    Message: string;

    @Expose()
    @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
    TimeStamp: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvCode?.CreateUserWidgetPosition)
    EvCode: string;

    @Expose()
    @Transform(({ value }) => value ?? WidgetPositioningEvType?.Success)
    EvType: string;
}
