import { Controller, Get, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { map, Observable } from 'rxjs';

import { GetSettingsRequestDto, GetSettingsResponseDto } from './dto/get-settings.dto';
import { SettingService } from './setting.service';
import { buildResponse } from '../utils/build-response.util';
import { handleRxSuccess } from '../common/responses/success.response.common';
import { WidgetEvCode, WidgetMessage } from './constants/setting.enum';

@Controller('wide-api/setting')
export class SettingController {
    constructor(private readonly settingService: SettingService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getSettings(@Query(new ValidationPipe({ transform: true })) query: GetSettingsRequestDto, @Req() req: any): Observable<GetSettingsResponseDto> {
        const tenantCode = req.user?.tenantCode ?? '';

        return this.settingService.getSettings(query, tenantCode).pipe(
            map((widgets: any) => buildResponse(GetSettingsResponseDto, handleRxSuccess(widgets, WidgetEvCode?.GetSettings, WidgetMessage?.PageWidgetMappingDeleted)))
        );
    }
}
