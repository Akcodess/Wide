import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, map, of, switchMap, throwError, tap } from 'rxjs';

import { Widget } from './widget.entity';
import { PageWidget } from '../widget-pagecode/page-widget.entity';
import { PageWidgetPosition } from '../widget-positioning/page-widget-position.entity';
import { UserWidgetPosition } from '../user-widget/user-widget-position.entity';
import { Setting } from '../setting/setting.entity';
import { CreateWidgetRequestDto } from './dto/create-widget.request.dto';
import { WidgetItemDto } from './dto/get-widgets.response.dto';
import { GetWidgetsQueryDto } from './dto/get-widgets.query.dto';
import { WidgetMessage } from './constants/widget.enums';

@Injectable()
export class WidgetService {
  private readonly logger = new Logger(WidgetService.name);
  constructor(
    @InjectRepository(Widget) private readonly widgetRepo: Repository<Widget>,
    @InjectRepository(PageWidget) private readonly pageWidgetRepo: Repository<PageWidget>,
    @InjectRepository(PageWidgetPosition) private readonly pageWidgetPositionRepo: Repository<PageWidgetPosition>,
    @InjectRepository(UserWidgetPosition) private readonly userWidgetPositionRepo: Repository<UserWidgetPosition>,
    @InjectRepository(Setting) private readonly settingRepo: Repository<Setting>,
  ) { }

  createWidget(body: CreateWidgetRequestDto, userId: number | string) {
    const params = {
      widgetConfig: JSON.stringify(body?.data?.widData ?? {}),
      applicationCode: body?.data?.applicationCode,
      createdBy: userId || null,
    } as any;

    const created = this.widgetRepo.create(params as Partial<Widget>);
    return from(this.widgetRepo.save(created)).pipe(
      tap(() => this.logger.log(`CreateWidget payload applicationCode=${body?.data?.applicationCode}, pageCode=${body?.data?.pageCode}`)),
      switchMap((saved: Widget) =>
        from(
          this.pageWidgetRepo.insert({
            applicationCode: body?.data?.applicationCode,
            pageCode: body?.data?.pageCode,
            widgetId: saved.id,
            createdBy: userId || null,
          } as any),
        ).pipe(
          tap(() => this.logger.log(`Widget created successfully id=${saved.id}`)),
          map(() => ({ widgetId: saved.id })),
        ),
      ),
    );
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
      tap((positions) => this.logger.log(`Positions loaded=${Array.isArray(positions) ? positions.length : 0} agentSpecific=${isAgentSpecific} applicationCode=${applicationCode} pageCode=${pageCode}`)),
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
      throw new BadRequestException(WidgetMessage?.InvalidWidgetConfig);
    }
  }

  private findWidgets(applicationCode: string, pageCode: string, userId: number | string) {
    return from(
      this.widgetRepo
        .createQueryBuilder('w')
        .innerJoin(PageWidget, 'pw', 'pw.WidgetId = w.Id AND pw.ApplicationCode = :applicationCode AND pw.PageCode = :pageCode', { applicationCode, pageCode })
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
    ).pipe(
      tap((widgets) => this.logger.log(`Widgets loaded=${Array.isArray(widgets) ? widgets.length : 0} applicationCode=${applicationCode} pageCode=${pageCode} userId=${userId}`)),
    );
  }

  getWidgets(params: GetWidgetsQueryDto, userId: number | string) {
    const { applicationCode, pageCode } = params;

    return this.findWidgets(applicationCode, pageCode, userId).pipe(
      tap(() => this.logger.log(`GetWidgets called applicationCode=${applicationCode} pageCode=${pageCode} userId=${userId}`)),
      switchMap((widgets) => {
        if (!widgets.length) {
          this.logger.warn(WidgetMessage?.NoWidgetsFound);
          return throwError(() => new NotFoundException(WidgetMessage?.NoWidgetsFound));
        }
        return this.isAgentSpecific(applicationCode, pageCode).pipe(
          switchMap((agentSpecific) =>
            this.getPositionMap(applicationCode, pageCode, userId, agentSpecific).pipe(
              map((positionMap : Record<string, any>) => widgets.map((w) => this.buildWidgetResponse(w, positionMap))),
            ),
          ),
        );
      }),
    );
  }
}
