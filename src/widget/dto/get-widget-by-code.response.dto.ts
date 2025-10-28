import moment from 'moment';
import { Widget } from '../widget.entity';
import { Expose, Transform, Type } from 'class-transformer';
import { WidgetEvCode, WidgetEvType, WidgetMessage } from '../constants/widget.enums';
import { ApiProperty } from '@nestjs/swagger';

export class GetWidgetByCodeResponseDto {
  @ApiProperty()
  @Expose()
  Status!: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetMessage?.WidgetFoundByCode)
  Message!: string;

  @ApiProperty()
  @Expose()
  @Type(() => Object)
  Widget!: Widget | null;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
  TimeStamp!: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvCode.GetWidgetByCode)
  EvCode!: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value ?? WidgetEvType?.Success)
  EvType!: string;
}
