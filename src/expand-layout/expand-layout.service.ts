import { BadRequestException, Injectable } from '@nestjs/common';
import { catchError, from, map, switchMap, throwError } from 'rxjs';

@Injectable()
export class ExpandLayoutService {

    // private async ensureRepos(tenantCode: string): Promise<void> {
    //     this.widgetRepo = await this.tenantConn.getRepository(Widget, tenantCode);
    // }

    // getAllExpandLayouts(tenantCode: string) {
    //     return from(this.ensureRepos(tenantCode)).pipe(
    //         switchMap(() => from(this.expandLayoutRepo.find())),
    //         map((expandLayouts) => expandLayouts),
    //         catchError((err) => throwError(() => new BadRequestException({ Status: 500, Message: err?.message || 'Some error occurred while fetching all ExpandLayouts.' })))
    //     );
    // }
}
