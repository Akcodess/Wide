import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { from, switchMap, throwError } from 'rxjs';
import { Repository } from 'typeorm';

import { GetWidgetByPageCodeRequestDto } from './dto/get-widget-by-pagecode.request.dto';
import { WidgetService } from '../widget/widget.service';
import { Widget } from '../widget/widget.entity';
import { PageWidget } from '../widget-pagecode/page-widget.entity';
import { PageWidgetPosition } from '../widget-positioning/page-widget-position.entity';
import { UserWidgetPosition } from '../user-widget/user-widget-position.entity';
import { Setting } from '../setting/setting.entity';
import { TenantConnectionService } from '../tenant/tenant-connection.service';
import { WidgetMessage, WidgetStatus } from './constants/widget.pagecode.enums';

@Injectable()
export class WidgetPagecodeService {
  private readonly logger = new Logger(WidgetService.name);
  private widgetRepo!: Repository<Widget>;
  private pageWidgetRepo!: Repository<PageWidget>;
  private pageWidgetPositionRepo!: Repository<PageWidgetPosition>;
  private userWidgetPositionRepo!: Repository<UserWidgetPosition>;
  private settingRepo!: Repository<Setting>;

  constructor(private readonly tenantConn: TenantConnectionService) { }

  private async ensureRepos(tenantCode: string): Promise<void> {
    this.widgetRepo = await this.tenantConn.getRepository(Widget, tenantCode);
    this.pageWidgetRepo = await this.tenantConn.getRepository(PageWidget, tenantCode);
    this.pageWidgetPositionRepo = await this.tenantConn.getRepository(PageWidgetPosition, tenantCode);
    this.userWidgetPositionRepo = await this.tenantConn.getRepository(UserWidgetPosition, tenantCode);
    this.settingRepo = await this.tenantConn.getRepository(Setting, tenantCode);
  }

  private fetchWidgets(query: GetWidgetByPageCodeRequestDto) {
    return from(
      this.widgetRepo
        .createQueryBuilder('widget')
        .innerJoinAndSelect(this.pageWidgetRepo.metadata.tableName, 'page_widgets')
        .where('widget.ApplicationCode = :ApplicationCode', { ApplicationCode: query?.applicationCode })
        .andWhere('page_widgets.PageCode = :PageCode', { PageCode: query?.pageCode })
        .andWhere('widget.EntityState = 1')
        .andWhere('widget.IsShow = 1')
        .select([
          'widget.Id', 'widget.ApplicationCode', 'widget.WidgetName', 'widget.WidgetCode', 'widget.WidgetType', 'widget.WidgetConfig', 'widget.SourceData', 'widget.SourceType', 'widget.WidgetStyle',
          'widget.HeaderStyle', 'widget.EntityState', 'widget.IsShow', 'widget.UserIds', 'page_widgets.PageCode',
        ])
        .getRawMany()
    )
  }

  private transformWidgets(widgets: any[]) {
    return widgets.map((widget) => {
      const { page_widgets_PageCode, widget_UserIds, ...rest } = widget;

      let parsedUserIds: any[] = [];
      try {
        parsedUserIds = Array.isArray(widget_UserIds) ? widget_UserIds : typeof widget_UserIds === 'string' ? JSON.parse(widget_UserIds) : [];
      } catch (e) {
        this.logger.warn(`${WidgetMessage?.FailedToParseUserIds} ${widget.Id}`);
      }

      return { ...rest, PageCode: page_widgets_PageCode, UserIds: parsedUserIds };
    });
  }

  getWidgetsByPageCode(query: GetWidgetByPageCodeRequestDto, tenantCode: string) {
    const ensure$ = from(this.ensureRepos(tenantCode));

    return ensure$.pipe(
      switchMap(() => this.fetchWidgets(query)),
      switchMap((widgets) => {
        if (!widgets) {
          this.logger.warn(WidgetMessage?.NoWidgetsFound);
          return throwError(() => new NotFoundException({ Message: WidgetMessage?.NoWidgetsFound, Status: WidgetStatus?.NotFound }));
        }

        this.logger.log(WidgetMessage?.RetrievedSuccessfully);
        return from([this.transformWidgets(widgets)]);
      })
    );
  }
}
