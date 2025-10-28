import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CreateWidgetDataDto {
  @ApiProperty()
  @IsObject()
  widData: Record<string, any>;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  applicationCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  pageCode: string;
}

export class CreateWidgetRequestDto {
  @ApiProperty()
  @Type(() => CreateWidgetDataDto)
  data: CreateWidgetDataDto;
}
