import { Body, Controller, Delete, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { WidgetPositioningService } from './widget-positioning.service';
import { CreateWidgetPositionRequestDto, CreateWidgetPositionResponseDto } from './dto/create-widget-position.dto';
import { buildResponse } from '../utils/build-response.util';
import { WidgetPositioningEvCode, WidgetPositioningEvType, WidgetPositioningMessage, WidgetPositioningStatus } from './constants/widget-positioning.enum';
import { DeleteWidgetPositionRequestDto, DeleteWidgetPositionResponseDto } from './dto/delete-widget-position.dto';
import { CreateUserWidgetPositionRequestDto, CreateUserWidgetPositionResponseDto } from './dto/create-user-widget-position.dto';
import { DeleteUserWidgetPositionRequestDto, DeleteUserWidgetPositionResponseDto } from './dto/delete-user-widget-position-request.dto';

@Controller(process.env.WIDE_PRIFIX!)
export class WidgetPositioningController {
    constructor(private readonly widgetPositioningService: WidgetPositioningService) { }

    @Post('page-widget-pos')
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

    @Delete('page-widget-pos')
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

    @Post('user-widget-pos')
    @UseGuards(AuthGuard('jwt'))
    createUserWidgetPosition(@Body(new ValidationPipe({ transform: true })) createDto: CreateUserWidgetPositionRequestDto, @Req() req: any): Observable<CreateUserWidgetPositionResponseDto> {
        return this.widgetPositioningService.createUserWidgetPosition(createDto, req.user?.tenantCode ?? '', req.user?.id ?? createDto.userId ?? '').pipe(
            map(() => buildResponse(CreateUserWidgetPositionResponseDto, {
                Status: WidgetPositioningStatus?.Ok,
                Message: WidgetPositioningMessage?.UserWidgetPositionsCreatedUpdatedSuccessfully,
                EvCode: WidgetPositioningEvCode?.CreateUserWidgetPosition,
                EvType: WidgetPositioningEvType?.Success,
            })
            )
        );
    }

    @Delete('user-widget-pos')
    @UseGuards(AuthGuard('jwt'))
    deleteUserWidgetPosition(@Body(new ValidationPipe({ transform: true })) deleteDto: DeleteUserWidgetPositionRequestDto, @Req() req: any): Observable<DeleteUserWidgetPositionResponseDto> {
        return this.widgetPositioningService.deleteUserWidgetPosition(deleteDto, req.user?.tenantCode ?? '', req.user?.id ?? req.userId ?? '').pipe(
            map(() =>
                buildResponse(DeleteUserWidgetPositionResponseDto, {
                    Status: WidgetPositioningStatus?.Ok,
                    Message: WidgetPositioningMessage?.UserWidgetPositionDeletedSuccessfully,
                    EvCode: WidgetPositioningEvCode?.DeleteUserWidgetPosition,
                    EvType: WidgetPositioningEvType?.Success,
                }),
            ),
        );
    }
}
