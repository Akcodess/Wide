import { IsNotEmpty, IsString } from 'class-validator';

export class GetWidgetsByUserIdDto {
  @IsNotEmpty()
  @IsString()
  pageCode: string;

  @IsNotEmpty()
  @IsString()
  applicationCode: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}