import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { Repository, UpdateResult, IsNull, Raw } from 'typeorm';
import { from, map, of, switchMap, throwError, tap, catchError, defer, forkJoin, Observable } from 'rxjs';

import { Widget } from './widget.entity';
import { PageWidget } from '../widget-pagecode/page-widget.entity';
import { PageWidgetPosition } from '../widget-positioning/page-widget-position.entity';
import { UserWidgetPosition } from '../user-widget/user-widget-position.entity';
import { Setting } from '../setting/setting.entity';
import { TenantConnectionService } from '../tenant/tenant-connection.service';
import { CreateWidgetRequestDto } from './dto/create-widget.request.dto';
import { WidgetItemDto } from './dto/get-widgets.response.dto';
import { GetWidgetsQueryDto } from './dto/get-widgets.query.dto';
import { WidgetMessage, WidgetStatus } from './constants/widget.enums';
import { UpdateWidgetDto } from './dto/update-widget.request.dto';
import { GetWidgetsByUserIdDto } from './dto/get-widgets-by-user-id.request.dto';
import { CreateWidgetMappingDto } from './dto/create-widget-mapping.request.dto';

@Injectable()
export class WidgetService {
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

  private isAgentSpecific(applicationCode: string, pageCode: string) {
    return from(this.settingRepo.findOne({ where: { applicationCode, pageCode } })).pipe(
      map((settingData) => {
        if (!settingData?.settingConfig) return false;
        try {
          const config = Array.isArray(settingData.settingConfig) ? settingData.settingConfig : [];
          const agentSetting = config.find((s) => Object.prototype.hasOwnProperty.call(s, 'isOverrideAgentMapping'));
          return agentSetting?.['isOverrideAgentMapping'] === true;
        } catch {
          return false;
        }
      }),
    );
  }

  private getPositionMap(applicationCode: string, pageCode: string, userId: number | string, isAgentSpecific: boolean) {
    const fetchPositions$ = isAgentSpecific
      ? from(
        this.userWidgetPositionRepo.find({
          where: { applicationCode, userId: String(userId) },
          select: ['widgetId', 'position'],
        }) as any,
      ).pipe(
        switchMap((positions: any[]) =>
          positions.length
            ? of(positions)
            : (from(
              this.pageWidgetPositionRepo.find({
                where: { applicationCode, pageCode },
                select: ['widgetId', 'position'],
              }) as any,
            ) as any),
        ),
      )
      : (from(
        this.pageWidgetPositionRepo.find({
          where: { applicationCode, pageCode },
          select: ['widgetId', 'position'],
        }) as any,
      ) as any);

    return fetchPositions$.pipe(
      map((positions: Array<{ WidgetId: string; Position: string }>) => {
        const mapObj: Record<string, any> = {};
        for (const pos of positions) {
          try {
            mapObj[pos.WidgetId] = JSON.parse((pos as any).Position ?? (pos as any).position);
          } catch {
            mapObj[pos.WidgetId] = null;
          }
        }
        return mapObj;
      }),
    );
  }

  private buildWidgetResponse(widget: any, positionMap: Record<string, any>): WidgetItemDto {
    try {
      const Config = JSON.stringify(positionMap[widget.Id] ||
        (widget.WidgetConfig ? JSON.parse(widget.WidgetConfig) : {}));

      const safeUserIds = Array.isArray(widget?.UserIds) ? widget?.UserIds : typeof widget?.UserIds === 'string' ? JSON.parse(widget?.UserIds) : [];

      return {
        Id: widget.Id,
        ApplicationCode: widget.ApplicationCode,
        WidgetName: widget.WidgetName,
        WidgetCode: widget.WidgetCode,
        WidgetType: widget.WidgetType,
        SourceData: widget.SourceData,
        SourceType: widget.SourceType,
        WidgetStyle: widget.WidgetStyle,
        HeaderStyle: widget.HeaderStyle,
        EntityState: widget.EntityState,
        IsShow: widget.IsShow,
        PageCode: widget.PageCode,
        WidgetConfig: Config,
        UserIds: safeUserIds
      } as WidgetItemDto;
    } catch (error) {
      throw new BadRequestException({ Message: WidgetMessage?.InvalidWidgetConfig, Status: WidgetStatus.BadRequest });
    }
  }

  private findWidgets(applicationCode: string, pageCode: string, userId: number | string) {
    return from(
      this.widgetRepo
        .createQueryBuilder('w')
        .innerJoin(this.pageWidgetRepo.metadata.tableName, 'pw', 'pw.WidgetId = w.Id AND pw.ApplicationCode = :applicationCode AND pw.PageCode = :pageCode', { applicationCode, pageCode })
        .where('w.ApplicationCode = :applicationCode', { applicationCode })
        .andWhere('w.EntityState = :entityState', { entityState: 1 })
        .andWhere('w.IsShow = :isShow', { isShow: 1 })
        .andWhere('(w.UserIds IS NULL OR JSON_LENGTH(w.UserIds) = 0 OR JSON_CONTAINS(w.UserIds, :userIdJson) = true)', { userIdJson: JSON.stringify(Number(userId)) })
        .select([
          'w.Id as Id',
          'w.ApplicationCode as ApplicationCode',
          'w.WidgetName as WidgetName',
          'w.WidgetCode as WidgetCode',
          'w.WidgetType as WidgetType',
          'w.WidgetConfig as WidgetConfig',
          'w.SourceData as SourceData',
          'w.SourceType as SourceType',
          'w.WidgetStyle as WidgetStyle',
          'w.HeaderStyle as HeaderStyle',
          'w.EntityState as EntityState',
          'w.IsShow as IsShow',
          'w.UserIds as UserIds',
          'pw.PageCode as PageCode',
        ])
        .getRawMany(),
    );
  }

  private pascalToCamel$(obj: Record<string, any>) {
    return of(obj ?? {}).pipe(
      map((o) =>
        Object.fromEntries(
          Object.entries(o).map(([k, v]) => [k[0].toLowerCase() + k.slice(1), v]),
        ),
      ),
    );
  }

  private buildWidgetLayoutUpdate$(payload: Array<Record<string, any>>, userId: number | string): Observable<UpdateResult>[] {
    return payload.map((changeItem) => {
      const layout = {
        x: Number(changeItem?.x) || 0,
        y: Number(changeItem?.y) || 0,
        w: Number(changeItem?.w) || 0,
        h: Number(changeItem?.h) || 0,
      };
      const data: Partial<Widget> = {
        widgetConfig: JSON.stringify(layout),
        editedOn: new Date(),
        editedBy: Number(userId) || null,
      } as any;
      return defer(() => this.widgetRepo.update({ id: Number(changeItem?.i) }, data));
    });
  }

  private fetchWidgets(applicationCode: string, pageCode: string, userId: string): Observable<Widget[]> {
    return from(
      this.widgetRepo.find({
        relations: ['pageWidgets'],
        where: [
          { applicationCode, entityState: 1, isShow: 1, userIds: IsNull() },
          { applicationCode, entityState: 1, isShow: 1, userIds: Raw((alias) => `${alias} = '[]'`) },
          { applicationCode, entityState: 1, isShow: 1, userIds: Raw((alias) => `JSON_CONTAINS(${alias}, '[${userId}]')`) },
        ],
      }),
    ).pipe(
      switchMap((widgets) => {
        if (!widgets.length) {
          this.logger.warn(`${WidgetMessage?.NoWidgetsFound} ${applicationCode} - ${pageCode} - user ${userId}`);
          return throwError(() => new NotFoundException({ Message: WidgetMessage?.NoWidgetsFound, Status: WidgetStatus.NotFound }));
        }
        return from([widgets]);
      }),
    );
  }

  private mergeWidgetWithPositions(widgets: Widget[], positions: Array<{ widgetId: string; position: string }>): Widget[] {
    const posMap = positions.reduce((acc, p) => {
      try {
        acc[p.widgetId] = JSON.parse(p.position);
      } catch {
        acc[p.widgetId] = null;
      }
      return acc;
    }, {} as Record<string, any>);

    return widgets.map((w: any) => {
      let cfg: any = {};

      // Parse WidgetConfig if available
      try {
        cfg = w.WidgetConfig ? JSON.parse(w.WidgetConfig) : {};
      } catch { }

      // Override config if position exists
      if (posMap[w.Id]) cfg = posMap[w.Id];

      // Parse UserIds
      let uIds: any[] = [];
      try {
        uIds = Array.isArray(w.UserIds)
          ? w.UserIds
          : typeof w.UserIds === 'string'
            ? JSON.parse(w.UserIds)
            : [];
      } catch { }

      return { ...w, PageCode: w.page_widgets?.PageCode, WidgetId: w.Id, WidgetConfig: JSON.stringify(cfg), UserIds: uIds };
    });
  }

  private applyPositionOverrides(widgets: Widget[], applicationCode: string, pageCode: string, userId: string) {
    return from(this.settingRepo.findOne({ where: { applicationCode, pageCode } })).pipe(
      map((settingData) => {
        if (!settingData?.settingConfig) return true;
        try {
          const config = Array.isArray(settingData.settingConfig) ? settingData.settingConfig : [settingData.settingConfig];
          const agent = config.find((s) => s.hasOwnProperty('isOverrideAgentMapping'));
          return agent ? agent['isOverrideAgentMapping'] === 'true' : true;
        } catch {
          return true;
        }
      }),
      switchMap((isAgentSpecific) =>
        isAgentSpecific
          ? from(this.userWidgetPositionRepo.find({ where: { applicationCode, userId } }))
          : of([])
      ),
      switchMap((positions) =>
        positions.length
          ? of(positions)
          : from(this.pageWidgetPositionRepo.find({ where: { applicationCode, pageCode } }))
      ),
      map((positions) => this.mergeWidgetWithPositions(widgets, positions))
    );
  }

  createWidget(body: CreateWidgetRequestDto, userId: number | string, tenantCode: string) {
    const ensure$ = from(this.ensureRepos(tenantCode));
    const params = { widgetConfig: JSON.stringify(body?.data?.widData ?? {}), applicationCode: body?.data?.applicationCode, createdBy: userId || null } as any;

    return ensure$.pipe(
      switchMap(() => {
        const created = this.widgetRepo.create(params as Partial<Widget>);
        return from(this.widgetRepo.save(created)).pipe(
          switchMap((saved: Widget) =>
            from(
              this.pageWidgetRepo.insert({
                applicationCode: body?.data?.applicationCode,
                pageCode: body?.data?.pageCode,
                widgetId: saved.id,
                createdBy: userId || null,
              } as any),
            ).pipe(
              tap(() => this.logger.log(WidgetMessage?.AddedSuccessfully)),
              map(() => ({ widgetId: saved.id })),
            ),
          ),
        );
      }),
    );
  }

  getWidgets(params: GetWidgetsQueryDto, userId: number | string, tenantCode: string) {
    const { applicationCode, pageCode } = params;

    const ensure$ = from(this.ensureRepos(tenantCode));
    return ensure$.pipe(
      switchMap(() => this.findWidgets(applicationCode, pageCode, userId)),
      tap(() => this.logger.log(WidgetMessage?.GetWidgetsCalled)),
      switchMap((widgets) => {
        if (!widgets.length) {
          this.logger.warn(WidgetMessage?.NoWidgetsFound);
          return throwError(() => new NotFoundException({ Message: WidgetMessage?.NoWidgetsFound, Status: WidgetStatus.NotFound }));
        }
        return this.isAgentSpecific(applicationCode, pageCode).pipe(
          switchMap((agentSpecific) =>
            this.getPositionMap(applicationCode, pageCode, userId, agentSpecific).pipe(
              map((positionMap: Record<string, any>) => widgets.map((w) => this.buildWidgetResponse(w, positionMap))),
            ),
          ),
        );
      }),
    );
  }

  updateWidget(id: string, updateDto: UpdateWidgetDto, tenantCode: string, userId: number | string) {
    const ensure$ = from(this.ensureRepos(tenantCode));

    return ensure$.pipe(
      switchMap(() => {
        if (Number.isNaN(Number(id))) {
          this.logger.warn(`${WidgetMessage?.UdpadteInvalidUserId} ${id}`);
          return throwError(() => new BadRequestException({ Message: WidgetMessage?.InvalidUserId, Status: WidgetStatus.BadRequest }));
        }
        return from(this.widgetRepo.findOne({ where: { id: Number(id) } }));
      }),
      switchMap((existingWidget) => {
        if (!existingWidget) {
          this.logger.warn(`${WidgetMessage?.UpdateWidgetNotFound} ${id}`);
          return throwError(() => new NotFoundException({ Message: WidgetMessage?.WidgetNotFound, Status: WidgetStatus.NotFound }));
        }

        return this.pascalToCamel$((updateDto as any)?.data ?? {}).pipe(
          map((camelData) => ({ ...camelData, editedBy: Number(userId) })),
          switchMap((camelData) =>
            from(this.widgetRepo.save(this.widgetRepo.merge(existingWidget, camelData))).pipe(
              catchError((err) =>
                throwError(() => new BadRequestException({ Message: err?.message, Status: WidgetStatus.BadRequest })),
              ),
            ),
          ),
        );
      }),
      tap((savedWidget) => this.logger.log(`${WidgetMessage?.WidgetUpdated} Id: ${savedWidget?.id}`)),
      map((savedWidget) => ({ WidgetId: savedWidget.id }))
    );
  }

  updateWidgetLayout(updateDto: any, tenantCode: string, userId: number | string) {
    const ensure$ = from(this.ensureRepos(tenantCode));

    return ensure$.pipe(
      switchMap(() => {
        const payload = Array.isArray(updateDto) ? updateDto : [];
        if (!payload.length) {
          this.logger.warn(WidgetMessage?.ErrorUpdating);
          return throwError(() => new BadRequestException({ Message: WidgetMessage?.InvalidPayload, Status: WidgetStatus.BadRequest }));
        }
        return forkJoin(this.buildWidgetLayoutUpdate$(payload, userId));
      }),
      tap(() => this.logger.log(WidgetMessage?.WidgetLayoutUpdated)),
      map(() => ({ WidgetId: null })),
      catchError((err) => throwError(() => new BadRequestException({ Message: err?.message, Status: WidgetStatus.BadRequest }))),
    );
  }

  getWidgetByWidgetCode(code: string, tenantCode: string) {
    const ensure$ = from(this.ensureRepos(tenantCode));
    return ensure$.pipe(
      switchMap(() => {
        return from(
          this.widgetRepo.findOne({ where: { widgetCode: code } })
        );
      }),
      switchMap((widget) => {
        if (!widget) {
          return throwError(() => new NotFoundException({ Message: WidgetMessage.WidgetCodeNotFound, Status: WidgetStatus.NotFound }),
          );
        }
        return of(widget);
      }),
      tap(() => this.logger.log(`${WidgetMessage?.WidgetFoundWithCode} ${code}`)),
      catchError((err) => throwError(() => new BadRequestException({ Message: err?.message ?? WidgetMessage.ErrorUpdating, Status: WidgetStatus.BadRequest })))
    );
  }

  deleteWidget(id: string, tenantCode: string) {
    const ensure$ = from(this.ensureRepos(tenantCode));
    return ensure$.pipe(
      switchMap(() => {
        if (Number.isNaN(Number(id))) {
          return throwError(() => new BadRequestException({ Message: WidgetMessage.InvalidUserId, Status: WidgetStatus.BadRequest }));
        }
        const deleteRelations$ = forkJoin([
          defer(() => this.pageWidgetRepo.delete({ widgetId: Number(id) } as any)),
          defer(() => this.pageWidgetPositionRepo.delete({ widgetId: Number(id) } as any)),
          defer(() => this.userWidgetPositionRepo.delete({ widgetId: Number(id) } as any)),
        ]);
        return deleteRelations$.pipe(
          switchMap(() => defer(() => this.widgetRepo.delete({ id: Number(id) } as any))),
          switchMap((result) => {
            if (!result?.affected) {
              return throwError(() => new NotFoundException({ Message: WidgetMessage.DeleteNotAllowed, Status: WidgetStatus.NotFound }));
            }
            return of({ ok: true });
          }),
        );
      }),
      tap(() => this.logger.log(WidgetMessage.WidgetDeleted)),
      map(() => ({ WidgetId: Number(id) })),
      catchError((err) => throwError(() => new BadRequestException({ Message: err?.message ?? WidgetMessage.ErrorDeleting, Status: WidgetStatus.BadRequest }))),
    );
  }

  getWidgetsByUserId(query: GetWidgetsByUserIdDto, tenantCode: string) {
    const { applicationCode, pageCode, userId } = query;

    return from(this.ensureRepos(tenantCode)).pipe(
      switchMap(() => this.fetchWidgets(applicationCode, pageCode, userId)),
      switchMap((widgets) =>
        this.applyPositionOverrides(widgets, applicationCode, pageCode, userId)
      ),
      catchError((err) => {
        this.logger.error(`${WidgetMessage?.ErrorFetchingWidgets} ${userId}`, err);
        return throwError(() => new BadRequestException({ Message: err?.message, Status: WidgetStatus.BadRequest }));
      }),
    );
  }

  createWidgetMapping(body: CreateWidgetMappingDto, tenantCode: string) {
    const { widgetId, userId } = body;

    return from(this.ensureRepos(tenantCode)).pipe(
      switchMap(() =>
        from(this.widgetRepo.findOne({ where: { id: Number(widgetId) } }))
      ),
      switchMap((widget) => {
        if (!widget) {
          this.logger.warn(`${WidgetMessage?.WidgetNotFound} ${widgetId}`);
          return throwError(() => new NotFoundException({ Message: WidgetMessage?.WidgetNotFound, Status: WidgetStatus.NotFound }));
        }

        const userIdsStr = JSON.stringify(Array.isArray(userId) ? userId : [userId]);

        return from(this.widgetRepo.update({ id: Number(widgetId) }, { userIds: userIdsStr as any }));
      }),
      catchError((err) => {
        this.logger.error(WidgetMessage?.ErrorUpdatingMapping, err);
        return throwError(() => new BadRequestException({ Message: err?.message || WidgetMessage?.ErrorUpdatingMapping, Status: WidgetStatus.BadRequest }));
      })
    );
  }
}