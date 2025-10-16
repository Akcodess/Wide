import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateWidgetMappingDto {
  @IsNumber()
  @IsNotEmpty()
  widgetId: number;

  @IsArray()
  @IsNotEmpty()
  userId: number[] | number;
}