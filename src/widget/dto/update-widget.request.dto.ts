import { IsOptional, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWidgetDataDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  HeaderStyle?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  WidgetStyle?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  IsShow?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  SourceData?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  SourceType?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  WidgetCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  WidgetName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  WidgetType?: string;
}

export class UpdateWidgetDto {
  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateWidgetDataDto)
  data?: UpdateWidgetDataDto;
}