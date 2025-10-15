import { Controller, Get, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { from, map, Observable } from 'rxjs';

import { GetWidgetByPageCodeResponseDto } from './dto/get-widget-by-pagecode.response.dto';
import { WidgetPagecodeService } from './widget-pagecode.service'
import { GetWidgetByPageCodeRequestDto } from './dto/get-widget-by-pagecode.request.dto';
import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from './constants/widget.pagecode.enums';
import { buildResponse } from '../utils/build-response.util';

@Controller('wide-api/widget-pagecode')
export class WidgetPagecodeController {
  constructor(private readonly widgetPagecodeService: WidgetPagecodeService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getWidgetByPageCode(@Query(new ValidationPipe({ transform: true })) query: GetWidgetByPageCodeRequestDto, @Req() req: any): Observable<GetWidgetByPageCodeResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';

    return from(this.widgetPagecodeService.getWidgetsByPageCode(query, tenantCode)).pipe(
      map((widgets) => buildResponse(GetWidgetByPageCodeResponseDto, {
        Status: WidgetStatus.Ok,
        Message: WidgetMessage.RetrievedSuccessfully,
        EvCode: WidgetEvCode.GetWidgetByPageCode,
        EvType: WidgetEvType.Success,
        Widgets: widgets,
      }))
    );
  }
}
