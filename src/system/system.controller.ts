import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import moment from 'moment';

import { VersionResponseDto, HealthResponseDto, VersionRequestDto } from './dto/system.dto';
import { SystemEvCode, SystemEvMessage, SystemEvType, SystemStatus } from './constants/system.enum';

@Controller(`${process.env.WIDE_PRIFIX}`)
export class SystemController {

  @Get('version')
  @ApiResponse({ status: SystemStatus?.Ok, description: SystemEvMessage?.VersionInfoFetched, type: VersionResponseDto })
  @ApiResponse({ status: SystemStatus?.BadRequest, description: SystemEvMessage?.ErrorFetchingVersion })
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
  @ApiResponse({ status: SystemStatus?.Ok, type: HealthResponseDto })
  @ApiResponse({ status: SystemStatus?.BadRequest })
  checkHealth(): HealthResponseDto {
    return { Text: 'OK', Status: SystemStatus?.Ok };
  }
}