
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { forkJoin, from } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Repository } from 'typeorm';

import { TenantConnectionService } from '../tenant/tenant-connection.service';
import { PageWidgetPosition } from './page-widget-position.entity';
import { CreateWidgetPositionRequestDto } from './dto/create-widget-position.dto';
import { handleRxError } from '../common/responses/error.response.common';
import { WidgetPositioningEvCode, WidgetPositioningMessage } from './constants/widget-positioning.enum';
import { DeleteWidgetPositionRequestDto } from './dto/delete-widget-position.dto';

@Injectable()
export class WidgetPositioningService {
    private readonly logger = new Logger(WidgetPositioningService.name);
    private pageWidgetPosition!: Repository<PageWidgetPosition>;

    constructor(private readonly tenantConn: TenantConnectionService) { }

    private async ensureRepos(tenantCode: string): Promise<void> {
        this.pageWidgetPosition = await this.tenantConn.getRepository(PageWidgetPosition, tenantCode);
    }

    private saveOrUpdateWidgetPosition(item: any, dto: CreateWidgetPositionRequestDto, userId: number) {
        const { applicationCode, pageCode } = dto;
        const widgetId = String(item.i);

        return from(
            this.pageWidgetPosition.findOne({ where: { widgetId, applicationCode, pageCode } })
        ).pipe(
            mergeMap(existing => {
                const position = JSON.stringify({
                    x: item.x || 0,
                    y: item.y || 0,
                    w: item.w || 0,
                    h: item.h || 0,
                });

                return !existing
                    ? from(this.pageWidgetPosition.save({ widgetId, applicationCode, pageCode, position, createdBy: userId }))
                    : from(
                        this.pageWidgetPosition.update(
                            { widgetId, applicationCode, pageCode },
                            { position, editedBy: userId, editedOn: new Date() }
                        )
                    );
            })
        );
    }

    createWidgetPosition(createDto: CreateWidgetPositionRequestDto, tenantCode: string, userId: number) {
        return from(this.ensureRepos(tenantCode)).pipe(
            switchMap(() => forkJoin(createDto.position.map(item => this.saveOrUpdateWidgetPosition(item, createDto, userId)))),
            tap(() => this.logger.log(WidgetPositioningMessage?.WidgetPositionCreated)),
            map(() => true),
            catchError(err => {
                this.logger.error(WidgetPositioningMessage?.ErrorCreatingUpdatingWidgetPositions, err.stack);
                return handleRxError(err, WidgetPositioningEvCode?.CreateWidgetPosition, WidgetPositioningMessage?.ErrorCreatingUpdatingWidgetPositions);
            })
        );
    }

    deleteWidgetPosition(deleteDto: DeleteWidgetPositionRequestDto, tenantCode: string) {
        return from(this.ensureRepos(tenantCode)).pipe(
            switchMap(() =>
                from(this.pageWidgetPosition.delete({ widgetId: String(deleteDto.widgetId), applicationCode: deleteDto.applicationCode, pageCode: deleteDto.pageCode }))
            ),
            switchMap((result) => {
                if (!result.affected || result.affected === 0) {
                    return handleRxError(new NotFoundException(WidgetPositioningMessage?.NoMatchingWidgetPositionFound), WidgetPositioningEvCode?.DeletePageWidgetPosition, WidgetPositioningMessage?.NoMatchingWidgetPositionFound);
                }
                return from([true]);
            }),
            catchError((err) => {
                this.logger.error(WidgetPositioningMessage?.ErrorDeletingWidgetPosition, err.stack);
                return handleRxError(err, WidgetPositioningEvCode?.DeletePageWidgetPosition, WidgetPositioningMessage?.ErrorDeletingWidgetPosition);
            })
        );
    }
}
