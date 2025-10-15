import { IsNotEmpty, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { WidgetMessage } from "../constants/widget.enums";

export class GetWidgetByCodeDto {
  @Expose()
  @IsNotEmpty({ message: WidgetMessage?.WidgetCodeRequired })
  @IsString({ message: WidgetMessage?.WidgetCodeMustBeString })
  code!: string;
}