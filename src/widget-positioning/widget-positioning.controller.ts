import { Body, Controller, Delete, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ApiResponse } from '@nestjs/swagger';
import { map } from 'rxjs/operators';

import { WidgetPositioningService } from './widget-positioning.service';
import { CreateWidgetPositionRequestDto, CreateWidgetPositionResponseDto } from './dto/create-widget-position.dto';
import { buildResponse } from '../utils/build-response.util';
import { WidgetPositioningEvCode, WidgetPositioningMessage, WidgetPositioningStatus } from './constants/widget-positioning.enum';
import { DeleteWidgetPositionRequestDto, DeleteWidgetPositionResponseDto } from './dto/delete-widget-position.dto';
import { CreateUserWidgetPositionRequestDto, CreateUserWidgetPositionResponseDto } from './dto/create-user-widget-position.dto';
import { DeleteUserWidgetPositionRequestDto, DeleteUserWidgetPositionResponseDto } from './dto/delete-user-widget-position-request.dto';
import { handleRxSuccess } from '../common/responses/success.response.common';

@Controller(process.env.WIDE_PRIFIX!)
export class WidgetPositioningController {
    constructor(private readonly widgetPositioningService: WidgetPositioningService) { }

    @Post('page-widget-pos')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: WidgetPositioningStatus?.Ok, description: WidgetPositioningMessage?.WidgetPositionCreated, type: CreateWidgetPositionResponseDto })
    @ApiResponse({ status: WidgetPositioningStatus?.BadRequest, description: WidgetPositioningMessage?.ErrorCreatingUpdatingWidgetPositions })
    createWidgetPosition(@Body(new ValidationPipe({ transform: true })) createDto: CreateWidgetPositionRequestDto, @Req() req: any): Observable<CreateWidgetPositionResponseDto> {
        return this.widgetPositioningService?.createWidgetPosition(createDto, req.user?.tenantCode ?? '', req.user?.userId ?? '').pipe(
            map(() => buildResponse(CreateWidgetPositionResponseDto, handleRxSuccess(null, WidgetPositioningEvCode?.CreateWidgetPosition, WidgetPositioningMessage?.WidgetPositionCreated))),
        );
    }

    @Delete('page-widget-pos')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: WidgetPositioningStatus?.Ok, description: WidgetPositioningMessage?.WidgetPositionDeletedSuccessfully, type: DeleteWidgetPositionResponseDto })
    @ApiResponse({ status: WidgetPositioningStatus?.BadRequest, description: WidgetPositioningMessage?.ErrorDeletingWidgetPosition })
    deleteWidgetPosition(@Body(new ValidationPipe({ transform: true })) deleteDto: DeleteWidgetPositionRequestDto, @Req() req: any): Observable<DeleteWidgetPositionResponseDto> {
        return this.widgetPositioningService?.deleteWidgetPosition(deleteDto, req.user?.tenantCode ?? '').pipe(
            map(() => buildResponse(DeleteWidgetPositionResponseDto, handleRxSuccess(null, WidgetPositioningEvCode?.DeletePageWidgetPosition, WidgetPositioningMessage?.WidgetPositionDeletedSuccessfully))),
        );
    }

    @Post('user-widget-pos')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: WidgetPositioningStatus?.Ok, description: WidgetPositioningMessage?.UserWidgetPositionsCreatedUpdatedSuccessfully, type: CreateUserWidgetPositionResponseDto })
    @ApiResponse({ status: WidgetPositioningStatus?.BadRequest, description: WidgetPositioningMessage?.ErrorCreatingUpdatingUserWidgetPositions })
    createUserWidgetPosition(@Body(new ValidationPipe({ transform: true })) createDto: CreateUserWidgetPositionRequestDto, @Req() req: any): Observable<CreateUserWidgetPositionResponseDto> {
        return this.widgetPositioningService.createUserWidgetPosition(createDto, req.user?.tenantCode ?? '', req.user?.id ?? createDto.userId ?? '').pipe(
            map(() => buildResponse(CreateUserWidgetPositionResponseDto, handleRxSuccess(null, WidgetPositioningEvCode?.CreateUserWidgetPosition, WidgetPositioningMessage?.UserWidgetPositionsCreatedUpdatedSuccessfully)))
        );
    }

    @Delete('user-widget-pos')
    @UseGuards(AuthGuard('jwt'))
    @ApiResponse({ status: WidgetPositioningStatus?.Ok, description: WidgetPositioningMessage?.UserWidgetPositionDeletedSuccessfully, type: DeleteUserWidgetPositionResponseDto })
    @ApiResponse({ status: WidgetPositioningStatus?.BadRequest, description: WidgetPositioningMessage?.ErrorDeletingUserWidgetPosition })
    deleteUserWidgetPosition(@Body(new ValidationPipe({ transform: true })) deleteDto: DeleteUserWidgetPositionRequestDto, @Req() req: any): Observable<DeleteUserWidgetPositionResponseDto> {
        return this.widgetPositioningService.deleteUserWidgetPosition(deleteDto, req.user?.tenantCode ?? '', req.user?.id ?? req.userId ?? '').pipe(
            map(() =>
                buildResponse(DeleteUserWidgetPositionResponseDto, handleRxSuccess(null, WidgetPositioningEvCode?.DeleteUserWidgetPosition, WidgetPositioningMessage?.UserWidgetPositionDeletedSuccessfully)),
            ),
        );
    }
}
