import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetWidgetsQueryDto {
  @IsNotEmpty({ message: 'applicationCode is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  applicationCode: string;

  @IsNotEmpty({ message: 'pageCode is required' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  pageCode: string;
}
