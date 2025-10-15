import { Widget } from '../widget.entity';
import { Expose, Type } from 'class-transformer';

export class GetWidgetByCodeResponseDto {
  @Expose()
  Status!: number;

  @Expose()
  Message!: string;

  @Expose()
  @Type(() => Object)
  Widget!: Widget | null;

  @Expose()
  TimeStamp!: string;

  @Expose()
  EvCode!: string;

  @Expose()
  EvType!: string;
}
