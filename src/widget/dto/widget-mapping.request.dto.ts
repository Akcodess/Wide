import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWidgetMappingDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  widgetId: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  userId: number[] | number;
}