import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { WidgetMessage } from '../constants/widget.enums';
import { ApiProperty } from '@nestjs/swagger';

export class GetWidgetsQueryDto {
    @ApiProperty()
  @IsNotEmpty({ message: WidgetMessage?.ApplicationCodeRequired })
  @IsString()
  @Transform(({ value }) => value?.trim())
  applicationCode: string;

  @ApiProperty()
  @IsNotEmpty({ message: WidgetMessage?.PageCodeRequired })
  @IsString()
  @Transform(({ value }) => value?.trim())
  pageCode: string;
}
