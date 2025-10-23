import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { map, Observable } from 'rxjs';

import { GetSettingsRequestDto, GetSettingsResponseDto } from './dto/get-settings.dto';
import { SettingService } from './setting.service';
import { buildResponse } from '../utils/build-response.util';
import { SettingEvCode, WidgetEvType, WidgetMessage, WidgetStatus } from './constants/setting.enum';
import { CreateSettingRequestDto, CreateSettingsResponseDto } from './dto/create-setting.dto';
import { UpdateSettingRequestDto, UpdateSettingsResponseDto } from './dto/update-setting.dto';
import { DeleteSettingResponseDto } from './dto/delete-setting.dto';
import { handleRxSuccess } from '../common/responses/success.response.common';

@Controller(`${process.env.WIDE_PRIFIX}/setting`)
export class SettingController {
    constructor(private readonly settingService: SettingService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getSettings(@Query(new ValidationPipe({ transform: true })) query: GetSettingsRequestDto, @Req() req: any): Observable<GetSettingsResponseDto> {
        const tenantCode = req.user?.tenantCode ?? '';

        return this.settingService?.getSettings(query, tenantCode).pipe(
            map((widgets: any) => buildResponse(GetSettingsResponseDto, handleRxSuccess(widgets, SettingEvCode?.GetSettings, WidgetMessage?.SettingsFetched))),
        );
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    createSetting(@Body(new ValidationPipe({ transform: true })) createDto: CreateSettingRequestDto, @Req() req: any): Observable<CreateSettingsResponseDto> {
        return this.settingService?.createSetting(createDto, req.user?.userId ?? '', req.user?.tenantCode ?? '').pipe(
            map(result => buildResponse(CreateSettingsResponseDto, handleRxSuccess(result, SettingEvCode?.CreateSetting, WidgetMessage?.SettingCreated))),
        );
    }

    @Put()
    @UseGuards(AuthGuard('jwt'))
    updateSetting(@Body(new ValidationPipe({ transform: true })) updateDto: UpdateSettingRequestDto, @Req() req: any): Observable<UpdateSettingsResponseDto> {
        return this.settingService?.updateSetting(updateDto, req.user?.tenantCode ?? '', req.user.userId).pipe(
            map(result => buildResponse(UpdateSettingsResponseDto, handleRxSuccess(null, SettingEvCode?.UpdateSetting, WidgetMessage?.SettingUpdated))),
        );
    }

    @Delete(":id")
    @UseGuards(AuthGuard('jwt'))
    deleteSetting(@Param('id', ParseIntPipe) id: number, @Req() req: any): Observable<DeleteSettingResponseDto> {
        return this.settingService?.deleteSetting({ id }, req.user?.tenantCode ?? '').pipe(
            map(result => buildResponse(DeleteSettingResponseDto, handleRxSuccess(null, SettingEvCode?.DeleteSetting, WidgetMessage?.SettingDeleted))),
        );
    }
}