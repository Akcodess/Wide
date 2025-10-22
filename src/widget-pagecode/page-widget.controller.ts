import { Controller, Post, Body, Req, UseGuards, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreatePageWidgetMappingDto, CreatePageWidgetMappingResponseDto } from './dto/page-widget-create-mapping.dto';
import { WidgetPagecodeService } from './widget-pagecode.service';
import { map, Observable } from 'rxjs';
import { buildResponse } from '../utils/build-response.util';
import { WidgetEvCode, WidgetMessage } from './constants/widget.pagecode.enums';
import { DeletePageWidgetMappingDto } from './dto/page-widget-delete-mapping.dto';
import { handleRxSuccess } from '../common/responses/success.response.common';

@Controller('wide-api/page-widget')
@UseGuards(AuthGuard('jwt'))
export class PageWidgetController {
  constructor(private readonly pageWidgetService: WidgetPagecodeService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createMapping(@Body() body: CreatePageWidgetMappingDto, @Req() req: any): Observable<CreatePageWidgetMappingResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    const userId = req.user?.userId ?? '';

    return this.pageWidgetService.createMappingPageWidgetPosition(body, tenantCode, userId).pipe(
      map((response) => buildResponse(CreatePageWidgetMappingResponseDto, handleRxSuccess(response, WidgetEvCode?.CreatePageCodeWidgetMapping, WidgetMessage?.PageWidgetMappingCreated)))
    )
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  deleteMapping(@Body() body: DeletePageWidgetMappingDto, @Req() req: any): Observable<CreatePageWidgetMappingResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';

    return this.pageWidgetService.deleteMappingPageWidgetPosition( body, tenantCode).pipe(
      map((response) =>
        buildResponse(CreatePageWidgetMappingResponseDto, handleRxSuccess(response, WidgetEvCode?.DeletePageCodeWidgetMapping, WidgetMessage?.PageWidgetMappingDeleted))
      )
    )
  }
}