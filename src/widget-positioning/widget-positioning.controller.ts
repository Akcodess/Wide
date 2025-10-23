import { Body, Controller, Delete, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WidgetPositioningService } from './widget-positioning.service';
import { CreateWidgetPositionRequestDto, CreateWidgetPositionResponseDto } from './dto/create-widget-position.dto';
import { buildResponse } from '../utils/build-response.util';
import { WidgetPositioningEvCode, WidgetPositioningEvType, WidgetPositioningMessage, WidgetPositioningStatus } from './constants/widget-positioning.enum';
import { DeleteWidgetPositionRequestDto, DeleteWidgetPositionResponseDto } from './dto/delete-widget-position.dto';

@Controller('wide-api/page-widget-pos')
export class WidgetPositioningController {
    constructor(private readonly widgetPositioningService: WidgetPositioningService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    createWidgetPosition(@Body(new ValidationPipe({ transform: true })) createDto: CreateWidgetPositionRequestDto, @Req() req: any): Observable<CreateWidgetPositionResponseDto> {
        return this.widgetPositioningService?.createWidgetPosition(createDto, req.user?.tenantCode ?? '', req.user?.userId ?? '').pipe(
            map(() => buildResponse(CreateWidgetPositionResponseDto, {
                Status: WidgetPositioningStatus?.Ok,
                Message: WidgetPositioningMessage?.WidgetPositionCreated,
                EvCode: WidgetPositioningEvCode?.CreateWidgetPosition,
                EvType: WidgetPositioningEvType?.Success
            }))
        );
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    deleteWidgetPosition(@Body(new ValidationPipe({ transform: true })) deleteDto: DeleteWidgetPositionRequestDto, @Req() req: any): Observable<DeleteWidgetPositionResponseDto> {
        return this.widgetPositioningService?.deleteWidgetPosition(deleteDto, req.user?.tenantCode ?? '').pipe(
            map(() => buildResponse(DeleteWidgetPositionResponseDto, {
                Status: WidgetPositioningStatus?.Ok,
                Message: WidgetPositioningMessage?.WidgetPositionDeletedSuccessfully,
                EvCode: WidgetPositioningEvCode?.DeletePageWidgetPosition,
                EvType: WidgetPositioningEvType?.Success
            }))
        );
    }
}
