import { Body, Controller, Get, Post, Query, UseGuards, Req, Patch, HttpCode, Param, Put, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { buildResponse } from './utils/build-response.util';

@Controller('wide-api/widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) { }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  createWidget(@Body() body: CreateWidgetRequestDto, @Req() req: any): Observable<CreateWidgetResponseDto> {
    const userId = req.user?.userId ?? '';
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.createWidget(body, userId, tenantCode).pipe(
      map(({ widgetId }) =>
        buildResponse(CreateWidgetResponseDto, {
          Status: WidgetStatus.Ok,
          Message: WidgetMessage.AddedSuccessfully,
          EvCode: WidgetEvCode.AddWidget,
          EvType: WidgetEvType.Success,
          data: { widgetId }
        }),
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
        buildResponse(GetWidgetsResponseDto, {
          Status: items.length ? WidgetStatus.Ok : WidgetStatus.NotFound,
          Message: items.length ? WidgetMessage.RetrievedSuccessfully : WidgetMessage.NoWidgetsFound,
          EvType: items.length ? WidgetEvType.Success : WidgetEvType.Failed,
          EvCode: WidgetEvCode.GetWidget,
          data: { WidgetList: items },
        }),
      ),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateWidget(@Param('id') id: string, @Req() req: any, @Body() body: UpdateWidgetDto): Observable<UpdateWidgetResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.updateWidget(id, body, tenantCode, req.user?.userId ?? '').pipe(
      map(() =>
        buildResponse(UpdateWidgetResponseDto, {
          Status: WidgetStatus.Ok,
          Message: WidgetMessage.WidgetUpdated,
          EvCode: WidgetEvCode.UpdateWidget,
          EvType: WidgetEvType.Success,
        }),
      ),
    );
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  updateWidgetLayout(@Req() req: any, @Body() body: UpdateWidgetLayoutItemDto[]): Observable<UpdateWidgetResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.updateWidgetLayout(body, tenantCode, req.user?.userId ?? '').pipe(
      map(() =>
        buildResponse(UpdateWidgetResponseDto, {
          Status: WidgetStatus.Ok,
          Message: WidgetMessage.WidgetLayoutUpdated,
          EvCode: WidgetEvCode.UpdateWidgetLayout,
          EvType: WidgetEvType.Success,
        }),
      ),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteWidget(@Param('id') id: string, @Req() req: any): Observable<UpdateWidgetResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.deleteWidget(id, tenantCode).pipe(
      map(() =>
        buildResponse(UpdateWidgetResponseDto, {
          Status: WidgetStatus.Ok,
          Message: WidgetMessage.WidgetDeleted,
          EvCode: WidgetEvCode.DeleteWidget,
          EvType: WidgetEvType.Success,
        }),
      ),
    );
  }

  @Get(':code')
  @UseGuards(AuthGuard('jwt'))
  getWidgetByWidgetCode(@Param(new ValidationPipe({ transform: true })) params: GetWidgetByCodeDto, @Req() req: any): Observable<GetWidgetByCodeResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';

    return this.widgetService.getWidgetByWidgetCode(params?.code, tenantCode).pipe(
      map((widget) =>
        buildResponse(GetWidgetByCodeResponseDto, {
          Status: WidgetStatus.Ok,
          Message: WidgetMessage.WidgetFoundByCode,
          EvCode: WidgetEvCode.GetWidgetByCode,
          EvType: WidgetEvType.Success,
          Widget: widget,
        }),
      ),
    );
  }
}
