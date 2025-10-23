import { Body, Controller, Get, Post, Query, UseGuards, Req, Patch, Param, Put, Delete, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { map, Observable } from 'rxjs';

import { WidgetService } from './widget.service';
import { GetWidgetsQueryDto } from './dto/get-widgets.query.dto';
import { GetWidgetsResponseDto } from './dto/get-widgets.response.dto';
import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from './constants/widget.enums';
import { CreateWidgetRequestDto } from './dto/create-widget.request.dto';
import { CreateWidgetResponseDto } from './dto/create-widget.response.dto';
import { WidgetItemDto } from './dto/get-widgets.response.dto';
import { UpdateWidgetDto } from './dto/update-widget.request.dto';
import { UpdateWidgetResponseDto } from './dto/update-widget.response.dto';
import { UpdateWidgetLayoutItemDto } from './dto/update-widget-layout.request.dto';
import { GetWidgetByCodeResponseDto } from './dto/get-widget-by-code.response.dto';
import { GetWidgetByCodeDto } from './dto/get-widget-by-code.request.dto';
import { buildResponse } from '../utils/build-response.util';
import { GetWidgetsByUserIdDto } from './dto/get-widgets-by-user-id.request.dto';
import { GetWidgetsByUserIdResponseDto } from './dto/get-widgets-by-user-id.response.dto';
import { CreateWidgetMappingDto } from './dto/widget-mapping.request.dto';
import { CreateWidgetMappingResponseDto } from './dto/create-widget-mapping.response.dto';
import { DeleteWidgetUserMappingResponseDto } from './dto/delete-widget-mapping.response';
import { handleRxSuccess } from '../common/responses/success.response.common';

@Controller(`${process.env.WIDE_PRIFIX}/widget`)
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) { }

  @Patch('/user')
  @UseGuards(AuthGuard('jwt'))
  createWidgetMapping(@Body() body: CreateWidgetMappingDto, @Req() req: any): Observable<CreateWidgetMappingResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.createWidgetMapping(body, tenantCode).pipe(
      map(() =>
        buildResponse(CreateWidgetMappingResponseDto, handleRxSuccess(null, WidgetEvCode.UpdateWidgetMapping, WidgetMessage.WidgetMappingCreated)),
      ),
    )
  }

  @Delete('/user')
  @UseGuards(AuthGuard('jwt'))
  deleteWidgetUserMapping(@Body() body: CreateWidgetMappingDto, @Req() req: any): Observable<DeleteWidgetUserMappingResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.deleteWidgetUserMapping(body, tenantCode).pipe(
      map(() =>
        buildResponse(DeleteWidgetUserMappingResponseDto, handleRxSuccess(null, WidgetEvCode.UpdateWidgetMapping, `${body?.userId} ${WidgetMessage.WidgetMappingDeleted}`)),
      ),
    );
  }

  @Get('/user')
  @UseGuards(AuthGuard('jwt'))
  getWidgetsByUserId(@Query() query: GetWidgetsByUserIdDto, @Req() req: any): Observable<GetWidgetsByUserIdResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.getWidgetsByUserId(query, tenantCode).pipe(
      map((widgets) => buildResponse(GetWidgetsByUserIdResponseDto, handleRxSuccess(widgets, WidgetEvCode.GetWidget, WidgetMessage.RetrievedSuccessfully))),
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createWidget(@Body() body: CreateWidgetRequestDto, @Req() req: any): Observable<CreateWidgetResponseDto> {
    const userId = req.user?.userId ?? '';
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.createWidget(body, userId, tenantCode).pipe(
      map(({ widgetId }) =>
        buildResponse(CreateWidgetResponseDto, handleRxSuccess({ widgetId }, WidgetEvCode.AddWidget, WidgetMessage.AddedSuccessfully)),
      ),
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getWidgets(@Query() query: GetWidgetsQueryDto, @Req() req: any): Observable<GetWidgetsResponseDto> {
    const userId = req.user?.userId ?? '';
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.getWidgets(query, userId, tenantCode).pipe(
      map((items: WidgetItemDto[]) =>
        buildResponse(GetWidgetsResponseDto, handleRxSuccess(items, WidgetEvCode.GetWidget, items.length ? WidgetMessage.RetrievedSuccessfully : WidgetMessage.NoWidgetsFound)),
      ),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateWidget(@Param('id') id: string, @Req() req: any, @Body() body: UpdateWidgetDto): Observable<UpdateWidgetResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.updateWidget(id, body, tenantCode, req.user?.userId ?? '').pipe(
      map(() =>
        buildResponse(UpdateWidgetResponseDto, handleRxSuccess(null, WidgetEvCode.UpdateWidget, WidgetMessage.WidgetUpdated)),
      ),
    );
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  updateWidgetLayout(@Req() req: any, @Body() body: UpdateWidgetLayoutItemDto[]): Observable<UpdateWidgetResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.updateWidgetLayout(body, tenantCode, req.user?.userId ?? '').pipe(
      map(() =>
        buildResponse(UpdateWidgetResponseDto, handleRxSuccess(null, WidgetEvCode.UpdateWidgetLayout, WidgetMessage.WidgetLayoutUpdated)),
      ),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteWidget(@Param('id') id: string, @Req() req: any): Observable<UpdateWidgetResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.deleteWidget(id, tenantCode).pipe(
      map(() =>
        buildResponse(UpdateWidgetResponseDto, handleRxSuccess(null, WidgetEvCode.DeleteWidget, WidgetMessage.WidgetDeleted)),
      ),
    )
  }

  @Get(':code')
  @UseGuards(AuthGuard('jwt'))
  getWidgetByWidgetCode(@Param(new ValidationPipe({ transform: true })) params: GetWidgetByCodeDto, @Req() req: any): Observable<GetWidgetByCodeResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';

    return this.widgetService.getWidgetByWidgetCode(params?.code, tenantCode).pipe(
      map((widget) =>
        buildResponse(GetWidgetByCodeResponseDto, handleRxSuccess(widget, WidgetEvCode.GetWidgetByCode, WidgetMessage.WidgetFoundByCode)),
      ),
    );
  }
}
