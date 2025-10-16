import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreatePageWidgetMappingDto, CreatePageWidgetMappingResponseDto } from './dto/page-widget-dts';
import { WidgetPagecodeService } from './widget-pagecode.service';
import { map } from 'rxjs';
import { buildResponse } from '../utils/build-response.util';
import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from './constants/widget.pagecode.enums';

@Controller('wide-api/page-widget')
@UseGuards(AuthGuard('jwt'))
export class PageWidgetController {
  constructor(private readonly pageWidgetService: WidgetPagecodeService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createMapping(@Body() body: CreatePageWidgetMappingDto, @Req() req: any) {
    const tenantCode = req.user?.tenantCode ?? '';
    const userId = req.user?.userId ?? '';

    return this.pageWidgetService.createMappingPageWidgetPosition(body, tenantCode, userId).pipe(
      map((response) =>
        buildResponse(CreatePageWidgetMappingResponseDto, {
          Status: WidgetStatus?.Ok,
          Message: WidgetMessage?.PageWidgetMappingCreatedUpdated,
          EvCode: WidgetEvCode?.CreatePageCodeWidgetMapping,
          EvType: WidgetEvType?.Success,
        })
      )
    )
  }
}