import { IsNotEmpty, IsString } from 'class-validator';

export class GetWidgetByPageCodeRequestDto {
  @IsString()
  @IsNotEmpty() 
  applicationCode: string;

  @IsString()
  @IsNotEmpty()
  pageCode: string;
}
