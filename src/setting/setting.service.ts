import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Repository } from 'typeorm';

import { GetSettingsRequestDto } from './dto/get-settings.dto';
import { TenantConnectionService } from '../tenant/tenant-connection.service';
import { Setting } from './setting.entity';
import { WidgetService } from '../widget/widget.service';
import { handleRxError } from '../common/responses/error.response.common';
import { SettingEvCode, WidgetMessage } from './constants/setting.enum';
import { CreateSettingRequestDto } from './dto/create-setting.dto';
import { UpdateSettingRequestDto } from './dto/update-setting.dto';

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
              return handleRxError(new NotFoundException(), SettingEvCode?.GetSettings, WidgetMessage?.SettingsNotFound);
            }
            return setting;
          }),
          catchError((err) => {
            this.logger.error(WidgetMessage?.ErrorFetchingSettings, err.stack);
            return handleRxError(err, SettingEvCode?.GetSettings, WidgetMessage?.ErrorFetchingSettings);
          })
        );
      })
    );
  }

  createSetting(createDto: CreateSettingRequestDto, userId: number, tenantCode: string) {
    return from(this.ensureRepos(tenantCode)).pipe(
      switchMap(() => {
        const newSetting = {
          applicationCode: createDto.applicationCode,
          pageCode: createDto.pageCode,
          settingConfig: createDto.settingConfig,
          createdBy: userId,
        };

        return from(this.settingRepo.save(newSetting));
      }),
      catchError((err) => {
        this.logger.error(WidgetMessage?.ErrorCreatingSetting, err.stack);
        return handleRxError(err, SettingEvCode?.CreateSetting, WidgetMessage?.ErrorCreatingSetting);
      })
    );
  }

  updateSetting(payload: UpdateSettingRequestDto, tenantCode: string, userId: number) {
    return from(this.ensureRepos(tenantCode)).pipe(
      switchMap(() => {
        return from(this.settingRepo.findOne({ where: { id: payload?.id } }));
      }),
      switchMap((existingSetting) => {
        if (!existingSetting) {
          return handleRxError(new NotFoundException(), SettingEvCode?.UpdateSetting, WidgetMessage?.SettingsNotFound);
        }

        const updatedPayload = {
          settingConfig: payload?.settingConfig,
          editedBy: userId,
          editedOn: new Date()
        };

        return from(this.settingRepo.update({ id: payload?.id }, updatedPayload));
      }),
      switchMap(() => {
        return from(this.settingRepo.findOne({ where: { id: payload?.id } }));
      }),
      catchError(error => {
        this.logger.error(`${WidgetMessage?.ErrorUpdatingSetting} ${error.message}`);
        return handleRxError(error, SettingEvCode?.UpdateSetting, WidgetMessage?.ErrorUpdatingSetting);
      })
    );
  }

  deleteSetting(param : any, tenantCode: string) {
    const parsedId = parseInt(param?.id);

    return from(this.ensureRepos(tenantCode)).pipe(
      switchMap(() => this.settingRepo.findOne({ where: { id: parsedId } })),
      switchMap(existingSetting => {
        if (!existingSetting) {
          return handleRxError(new NotFoundException(), SettingEvCode?.DeleteSetting, WidgetMessage?.SettingsNotFound);
        }
        return from(this.settingRepo.delete({ id: parsedId }));
      }),
      catchError(error => {
        this.logger.error(`${WidgetMessage?.ErrorDeletingSetting} ${error.message}`);
        return handleRxError(error, SettingEvCode?.DeleteSetting, WidgetMessage?.ErrorDeletingSetting);
      })
    );
  }
}
