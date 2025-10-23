import { plainToInstance } from 'class-transformer';
import moment from 'moment';

import { BaseResponseOptions } from '../common/interfaces/widget.interface';

export function buildResponse<T>(dtoClass: new (...args: any[]) => T, options: BaseResponseOptions): T {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');

    return plainToInstance(dtoClass, {
        Status: options.Status ?? 200,
        Message: options.Message,
        EvCode: options.EvCode ?? null,
        EvType: options.EvType ?? null,
        TimeStamp: options.TimeStamp ?? timestamp,
        ...(options.Data ? { Data: options.Data } : {}),
        ...(options.Widget ? { Widget: options.Widget } : {}),
        ...(options.WidgetList ? { WidgetList: options.WidgetList } : {}),
        ...(options.Widgets ? { Widgets: options.Widgets } : {}),
        ...(options.SettingList ? { SettingList: options.SettingList } : {}),
        ...(options.Setting ? { Setting: options.Setting } : {}),
    });
}
