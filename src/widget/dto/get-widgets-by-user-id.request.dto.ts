import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetWidgetsByUserIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pageCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  applicationCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;
}