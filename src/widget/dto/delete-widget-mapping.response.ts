import { ApiProperty } from '@nestjs/swagger';

export class DeleteWidgetUserMappingResponseDto {
  @ApiProperty()
  Status: number;

  @ApiProperty()
  Message: string;

  @ApiProperty()
  TimeStamp: string;

  @ApiProperty()
  EvId: string;

  @ApiProperty()
  EvCode: string;

  @ApiProperty()
  EvType: string;
}
