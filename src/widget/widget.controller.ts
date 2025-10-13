import { Body, Controller, Get, Post, Query, UseGuards, Req } from '@nestjs/common';
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

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) { }
  @Post('/wide-api/widget')
  @UseGuards(AuthGuard('jwt'))
  createWidget(@Body() body: CreateWidgetRequestDto, @Req() req: any): Observable<CreateWidgetResponseDto> {
    const userId = req.user?.userId ?? '';
    return this.widgetService.createWidget(body, userId).pipe(
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

  @Get('/wide-api/widget')
  @UseGuards(AuthGuard('jwt'))
  getWidgets(@Query() query: GetWidgetsQueryDto, @Req() req: any): Observable<GetWidgetsResponseDto> {
    const userId = req.user?.userId ?? '';
    return this.widgetService.getWidgets(query, userId).pipe(
      map((items: WidgetItemDto[]) =>
        plainToInstance(GetWidgetsResponseDto, {
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

}
