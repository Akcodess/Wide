import { Body, Controller, Get, Post, Query, UseGuards, Req, Patch, HttpCode, Param, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WidgetService } from './widget.service';
import { GetWidgetsQueryDto } from './dto/get-widgets.query.dto';
import { GetWidgetsResponseDto } from './dto/get-widgets.response.dto';
import { plainToInstance } from 'class-transformer';
import { WidgetEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from './constants/widget.enums';
import { CreateWidgetRequestDto } from './dto/create-widget.request.dto';
import { CreateWidgetResponseDto } from './dto/create-widget.response.dto';
import { map, Observable } from 'rxjs';
import { WidgetItemDto } from './dto/get-widgets.response.dto';
import { UpdateWidgetDto } from './dto/update-widget.request.dto';
import { UpdateWidgetResponseDto } from './dto/update-widget.response.dto';
import { UpdateWidgetLayoutItemDto } from './dto/update-widget-layout.request.dto';

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
        plainToInstance(CreateWidgetResponseDto, {
          Status: WidgetStatus.Ok,
          Message: WidgetMessage.AddedSuccessfully,
          TimeStamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          data: { widgetId },
          EvCode: WidgetEvCode.AddWidget,
          EvType: WidgetEvType.Success,
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
      map((items: WidgetItemDto[]) => plainToInstance(GetWidgetsResponseDto, {
        Status: items.length ? WidgetStatus.Ok : WidgetStatus.NotFound,
        Message: items.length ? WidgetMessage.RetrievedSuccessfully : WidgetMessage.NoWidgetsFound,
        TimeStamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        WidgetList: items,
        EvType: items.length ? WidgetEvType.Success : WidgetEvType.Failed,
        EvCode: WidgetEvCode.GetWidget,
      }),
      ),
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  updateWidget(@Param('id') id: string, @Req() req: any, @Body() body: UpdateWidgetDto): Observable<UpdateWidgetResponseDto> {
    const tenantCode = req.user?.tenantCode ?? '';
    return this.widgetService.updateWidget(id, body, tenantCode, req.user?.userId ?? '').pipe(
      map((result) => plainToInstance(UpdateWidgetResponseDto, {
        Status: WidgetStatus.Ok,
        Message: WidgetMessage.WidgetUpdated,
        TimeStamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
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
      map((result) => plainToInstance(UpdateWidgetResponseDto, {
        Status: WidgetStatus.Ok,
        Message: WidgetMessage.WidgetLayoutUpdated,
        TimeStamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        EvCode: WidgetEvCode.UpdateWidgetLayout,
        EvType: WidgetEvType.Success,
      })),
    );
  }

}
