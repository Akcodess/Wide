import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class CreateWidgetDataDto {
  @IsObject()
  widData: Record<string, any>;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  applicationCode: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  pageCode: string;
}

export class CreateWidgetRequestDto {
  @Type(() => CreateWidgetDataDto)
  data: CreateWidgetDataDto;
}
