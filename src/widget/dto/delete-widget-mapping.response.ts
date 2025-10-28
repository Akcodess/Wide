import { Expose, Transform } from "class-transformer";
import moment from "moment";

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from "../constants/widget.enums";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteWidgetUserMappingResponseDto {
  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetStatus?.Ok)
  Status: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.WidgetMappingDeleted)
  Message: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode?.UpdateWidgetMapping)
  EvCode: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType: string;
}
