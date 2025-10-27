import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetWidgetByPageCodeRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  applicationCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pageCode: string;
}
