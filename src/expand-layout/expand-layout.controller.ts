import { Controller, Get, Req } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { ExpandLayoutService } from './expand-layout.service';
import { GetAllExpandLayoutsResponseDto } from './dto/expand-layout-response.dto';

@Controller('expand-layout')
export class ExpandLayoutController {
    constructor(private readonly expandLayoutService: ExpandLayoutService) { }

    // @Get()
    // getAllExpandLayouts(@Req() req: any): Observable<GetAllExpandLayoutsResponseDto> {
    //     const tenantCode = req.user?.tenantCode ?? '';

    //     return this.expandLayoutService.getAllExpandLayouts(tenantCode).pipe(
    //         map((expandLayouts) => ({
    //             Status: 200,
    //             Message: 'All ExpandLayouts fetched successfully!',
    //             ExpandLayouts: expandLayouts,
    //             EvCode: 'GetExpandLayouts',
    //             EvType: 'Success',
    //         })),
    //     );
    // }
}
