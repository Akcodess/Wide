import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import moment from 'moment';

import { WidgetPositioningEvCode, WidgetPositioningEvType, WidgetPositioningMessage, WidgetPositioningStatus } from '../constants/widget-positioning.enum';
import { ApiProperty } from '@nestjs/swagger';

class UserWidgetPositionItem {
  @ApiProperty()
  @IsNumber()
  i: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  x?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  y?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  w?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  h?: number;
}

export class CreateUserWidgetPositionRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicationCode: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserWidgetPositionItem)
  position: UserWidgetPositionItem[];
}

export class CreateUserWidgetPositionResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetPositioningStatus?.Ok)
  Status: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetPositioningMessage?.UserWidgetPositionsCreatedUpdatedSuccessfully)
  Message: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetPositioningEvCode?.CreateUserWidgetPosition)
  EvCode: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetPositioningEvType?.Success)
  EvType: string;
}
