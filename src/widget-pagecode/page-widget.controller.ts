import { Controller, Post, Body, Req, UseGuards, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { map, Observable } from 'rxjs';

import { CreatePageWidgetMappingDto, CreatePageWidgetMappingResponseDto } from './dto/page-widget-create-mapping.dto';
import { WidgetPagecodeService } from './widget-pagecode.service';
import { buildResponse } from '../utils/build-response.util';
import { WidgetEvCode, WidgetMessage, WidgetStatus } from './constants/widget.pagecode.enums';
import { DeletePageWidgetMappingDto } from './dto/page-widget-delete-mapping.dto';
import { handleRxSuccess } from '../common/responses/success.response.common';

@Controller(`${process.env.WIDE_PRIFIX}/page-widget`)
export class PageWidgetController {
  constructor(private readonly pageWidgetService: WidgetPagecodeService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: WidgetStatus?.Ok, description: WidgetMessage?.PageWidgetMappingCreated, type: CreatePageWidgetMappingResponseDto })
  @ApiResponse({ status: WidgetStatus?.BadRequest, description: WidgetMessage?.NoWidgetsFound })
  createMapping(@Body() body: CreatePageWidgetMappingDto, @Req() req: any): Observable<CreatePageWidgetMappingResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    const userId = req.user?.userId ?? '';

    return this.pageWidgetService.createMappingPageWidgetPosition(body, tenantCode, userId).pipe(
      map((response) => buildResponse(CreatePageWidgetMappingResponseDto, handleRxSuccess(null, WidgetEvCode?.CreatePageCodeWidgetMapping, WidgetMessage?.PageWidgetMappingCreated)))
    )
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: WidgetStatus?.Ok, description: WidgetMessage?.PageWidgetMappingDeleted, type: CreatePageWidgetMappingResponseDto })
  @ApiResponse({ status: WidgetStatus?.BadRequest, description: WidgetMessage?.PageWidgetMappingNotFound })
  deleteMapping(@Body() body: DeletePageWidgetMappingDto, @Req() req: any): Observable<CreatePageWidgetMappingResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';

    return this.pageWidgetService.deleteMappingPageWidgetPosition(body, tenantCode).pipe(
      map((response) => buildResponse(CreatePageWidgetMappingResponseDto, handleRxSuccess(null, WidgetEvCode?.DeletePageCodeWidgetMapping, WidgetMessage?.PageWidgetMappingDeleted)))
    )
  }
}