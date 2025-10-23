export interface BaseResponseOptions<T = any> {
    Status?: number;
    Message: string;
    EvCode?: string;
    EvType?: string;
    Data?: T;
    Widget?: T;
    WidgetList?: T;
    Widgets?: T;
    TimeStamp?: string;
    SettingList?: T;
    Setting?: T;
}

export interface SuccessResponse<T = unknown> {
    Status: number;
    Message: string;
    EvCode: string;
    EvType: 'Success' | 'Failed';
    Data?: T;
}