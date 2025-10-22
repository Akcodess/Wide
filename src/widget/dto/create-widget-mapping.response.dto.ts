import { Expose, Transform } from 'class-transformer';
import moment from 'moment';

import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from '../constants/widget.enums';

export class CreateWidgetMappingResponseDto {
  @Expose()
      @Transform(({ value }) => value ?? WidgetStatus.Ok)
      Status: number;
    
      @Expose()
      @Transform(({ value }) => value ?? WidgetMessage.WidgetMappingCreated)
      Message: string;
    
      @Expose()
      @Transform(({ value }) => value ?? moment().format('YYYY-MM-DD HH:mm:ss'))
      TimeStamp: string;
    
      @Expose()
      @Transform(({ value }) => value ?? WidgetEvType.Success)
      EvType: string;
    
      @Expose()
      @Transform(({ value }) => value ?? WidgetEvCode.UpdateWidgetMapping)
      EvCode: string;
}