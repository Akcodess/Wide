import { IsOptional, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateWidgetDataDto {
  @IsOptional()
  @IsString()
  HeaderStyle?: string;

  @IsOptional()
  @IsString()
  WidgetStyle?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  IsShow?: number;

  @IsOptional()
  @IsString()
  SourceData?: string;

  @IsOptional()
  @IsString()
  SourceType?: string;

  @IsOptional()
  @IsString()
  WidgetCode?: string;

  @IsOptional()
  @IsString()
  WidgetName?: string;

  @IsOptional()
  @IsString()
  WidgetType?: string;
}

export class UpdateWidgetDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateWidgetDataDto)
  data?: UpdateWidgetDataDto;
}