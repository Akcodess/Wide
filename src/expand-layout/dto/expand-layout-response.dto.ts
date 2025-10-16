import { ApiProperty } from '@nestjs/swagger';

export class ExpandLayoutDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  layoutName: string;

  @ApiProperty()
  description?: string;
}

export class GetAllExpandLayoutsResponseDto {
  @ApiProperty()
  Status: number;

  @ApiProperty()
  Message: string;

  @ApiProperty()
  TimeStamp: string;

  @ApiProperty({ type: [ExpandLayoutDto] })
  ExpandLayouts: ExpandLayoutDto[];

  @ApiProperty()
  EvCode: string;

  @ApiProperty()
  EvType: string;
}