import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { catchError, from, map, switchMap, tap, throwError } from 'rxjs';
import { Repository } from 'typeorm';

import { GetWidgetByPageCodeRequestDto } from './dto/get-widget-by-pagecode.request.dto';
import { WidgetService } from '../widget/widget.service';
import { Widget } from '../widget/widget.entity';
import { PageWidget } from '../widget-pagecode/page-widget.entity';
import { TenantConnectionService } from '../tenant/tenant-connection.service';
import { WidgetMessage, WidgetStatus } from './constants/widget.pagecode.enums';
import { CreatePageWidgetMappingDto } from './dto/page-widget-create-mapping.dto';
import { DeletePageWidgetMappingDto } from './dto/page-widget-delete-mapping.dto';

@Injectable()
export class WidgetPagecodeService {
  private readonly logger = new Logger(WidgetService.name);
  private widgetRepo!: Repository<Widget>;
  private pageWidgetRepo!: Repository<PageWidget>;

  constructor(private readonly tenantConn: TenantConnectionService) { }

  private async ensureRepos(tenantCode: string): Promise<void> {
    this.widgetRepo = await this.tenantConn.getRepository(Widget, tenantCode);
    this.pageWidgetRepo = await this.tenantConn.getRepository(PageWidget, tenantCode);
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

  createMappingPageWidgetPosition(body: CreatePageWidgetMappingDto, tenantCode: string, userId: number) {
    const ensure$ = from(this.ensureRepos(tenantCode));
    const { pageCode, widgetId, applicationCode } = body;

    return ensure$.pipe(
      switchMap(() =>
        from(this.pageWidgetRepo.findOne({
          where: { pageCode: pageCode, widgetId: widgetId },
        }),
        ),
      ),
      switchMap((existingMapping) => {
        if (!existingMapping) {
          const pageWidget: any = {
            pageCode: pageCode,
            widgetId: widgetId,
            applicationCode: applicationCode || null,
            createdBy: userId || null,
          };
          return from(this.pageWidgetRepo.save(pageWidget)).pipe(
            tap(() => this.logger.log(WidgetMessage?.PageWidgetMappingCreated)),
          )
        } else {
          return from(
            this.pageWidgetRepo.update({ widgetId: widgetId, applicationCode: applicationCode, pageCode: pageCode }, { editedBy: userId, editedOn: new Date() })).pipe(
              tap(() => this.logger.log(WidgetMessage?.PageWidgetMappingUpdated)),
            );
        }
      }),
      catchError((err) =>
        throwError(() => new BadRequestException({ Status: WidgetStatus?.InternalServerError, Message: err?.message })),
      ),
    );
  }

  deleteMappingPageWidgetPosition(body: DeletePageWidgetMappingDto, tenantCode: string) {
    const ensure$ = from(this.ensureRepos(tenantCode));
    const { pageCode, widgetId } = body;

    return ensure$.pipe(
      switchMap(() => from(this.pageWidgetRepo.delete({ pageCode: pageCode, widgetId: widgetId }))),
      tap((result) => {
        if (result.affected && result.affected > 0) {
          this.logger.log(WidgetMessage?.PageWidgetMappingDeleted);
        } else {
          this.logger.warn(WidgetMessage?.PageWidgetMappingNotFound);
        }
      }),
      map((result) => {
        if (!result.affected) { throw new NotFoundException({ Status: WidgetStatus?.NotFound, Message: WidgetMessage?.PageWidgetMappingNotFound }); }
        return result;
      }),
      catchError((err) => {
        this.logger.error(WidgetMessage?.ErrorDeletingMapping);
        return throwError(() => new BadRequestException({ Status: WidgetStatus?.InternalServerError, Message: err?.message }));
      })
    );
  }
}
