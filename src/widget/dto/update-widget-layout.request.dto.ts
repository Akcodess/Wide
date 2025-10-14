import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateWidgetLayoutItemDto {
  @Type(() => Number)
  @IsInt()
  w: number;

  @Type(() => Number)
  @IsInt()
  h: number;

  @Type(() => Number)
  @IsInt()
  x: number;

  @Type(() => Number)
  @IsInt()
  y: number;

  @Type(() => Number)
  @IsInt()
  i: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minH?: number;
}


