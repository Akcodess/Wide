import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import moment from 'moment';

import { VersionResponseDto, HealthResponseDto, VersionRequestDto } from './dto/system.dto';
import { SystemEvCode, SystemEvType, SystemStatus } from './constants/system.enum';

@Controller(`${process.env.WIDE_PRIFIX}`)
export class SystemController {

  @Get('version')
  getVersion(@Query(new ValidationPipe({ transform: true })) reqId?: VersionRequestDto): VersionResponseDto {
    return {
      ReqId: reqId?.reqId,
      EvType: SystemEvType?.Success,
      Version: {
        ReleaseVersion: process.env.VERSION ?? '',
        ReleaseDate: process.env.VERSIONDATE ?? '',
        Name: process.env.NUCLEUS_API_USER ?? '',
      },
      EvCode: SystemEvCode?.VersionInfoFetch,
      TimeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  @Get('health')
  checkHealth(): HealthResponseDto {
    return { Text: 'OK', Status: SystemStatus?.Ok };
  }
}