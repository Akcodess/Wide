import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateWidgetLayoutItemDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  w: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  h: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  x: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  y: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  i: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  minH?: number;
}


