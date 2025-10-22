import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Repository } from 'typeorm';

import { GetSettingsRequestDto } from './dto/get-settings.dto';
import { TenantConnectionService } from '../tenant/tenant-connection.service';
import { Setting } from './setting.entity';
import { WidgetService } from '../widget/widget.service';
import { handleRxError } from '../common/responses/error.response.common';
import { WidgetEvCode, WidgetMessage } from './constants/setting.enum';

@Injectable()
export class SettingService {
  private readonly logger = new Logger(WidgetService.name);
  private settingRepo!: Repository<Setting>;

  constructor(private readonly tenantConn: TenantConnectionService) { }

  private async ensureRepos(tenantCode: string): Promise<void> {
    this.settingRepo = await this.tenantConn.getRepository(Setting, tenantCode);
  }

  getSettings(queries: GetSettingsRequestDto, tenantCode: string) {
    return from(this.ensureRepos(tenantCode)).pipe(
      switchMap((repos) => {
        let queryConditions: any = {};

        if (queries.applicationCode) queryConditions.applicationCode = queries.applicationCode;
        if (queries.pageCode) queryConditions.pageCode = queries.pageCode;

        return from(this.settingRepo.findOne({ where: queryConditions })).pipe(
          map((setting) => {
            if (!setting) {
              return handleRxError(new NotFoundException(), WidgetEvCode?.GetSettings, WidgetMessage?.PageWidgetMappingNotFound);
            }
            return setting;
          }),
          catchError((err) => {
            this.logger.error(WidgetMessage?.ErrorFetchingSettings, err.stack);
            return handleRxError(err, WidgetEvCode?.GetSettings, WidgetMessage?.ErrorFetchingSettings);
          })
        );
      })
    );
  }
}
