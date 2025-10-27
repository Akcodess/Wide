import { Controller, Get, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, map, Observable } from 'rxjs';

import { GetWidgetByPageCodeResponseDto } from './dto/get-widget-by-pagecode.response.dto';
import { WidgetPagecodeService } from './widget-pagecode.service'
import { GetWidgetByPageCodeRequestDto } from './dto/get-widget-by-pagecode.request.dto';
import { WidgetEvCode, WidgetMessage, WidgetStatus } from './constants/widget.pagecode.enums';
import { buildResponse } from '../utils/build-response.util';
import { handleRxSuccess } from '../common/responses/success.response.common';
import { ApiResponse } from '@nestjs/swagger';

@Controller(`${process.env.WIDE_PRIFIX}/widget-pagecode`)
export class WidgetPagecodeController {
  constructor(private readonly widgetPagecodeService: WidgetPagecodeService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: WidgetStatus?.Ok, description: WidgetMessage?.RetrievedSuccessfully, type: GetWidgetByPageCodeResponseDto })
  @ApiResponse({ status: WidgetStatus?.BadRequest, description: WidgetMessage?.NoWidgetsFound })
  getWidgetByPageCode(@Query(new ValidationPipe({ transform: true })) query: GetWidgetByPageCodeRequestDto, @Req() req: any): Observable<GetWidgetByPageCodeResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';

    return from(this.widgetPagecodeService.getWidgetsByPageCode(query, tenantCode)).pipe(
      map((widgets) => buildResponse(GetWidgetByPageCodeResponseDto, handleRxSuccess(widgets, WidgetEvCode?.GetWidgetByPageCode, WidgetMessage?.RetrievedSuccessfully)))
    );
  }
}
