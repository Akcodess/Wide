import { plainToInstance } from 'class-transformer';
import { BaseResponseOptions } from '../interfaces/widget.interface';

export function buildResponse<T>(dtoClass: new (...args: any[]) => T, options: BaseResponseOptions): T {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return plainToInstance(dtoClass, {
        Status: options.Status ?? 200,
        Message: options.Message,
        EvCode: options.EvCode ?? null,
        EvType: options.EvType ?? null,
        TimeStamp: options.TimeStamp ?? timestamp,
        ...(options.data ? { data: options.data } : {}),
        ...(options.Widget ? { Widget: options.Widget } : {}),
        ...(options.WidgetList ? { WidgetList: options.WidgetList } : {}),
        ...(options.Widgets ? { Widgets: options.Widgets } : {}),
    });
}
