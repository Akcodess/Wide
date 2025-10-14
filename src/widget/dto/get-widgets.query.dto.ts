import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { WidgetMessage } from '../constants/widget.enums';

export class GetWidgetsQueryDto {
  @IsNotEmpty({ message: WidgetMessage?.ApplicationCodeRequired })
  @IsString()
  @Transform(({ value }) => value?.trim())
  applicationCode: string;

  @IsNotEmpty({ message: WidgetMessage?.PageCodeRequired })
  @IsString()
  @Transform(({ value }) => value?.trim())
  pageCode: string;
}
