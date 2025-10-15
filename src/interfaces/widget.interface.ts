export interface BaseResponseOptions<T = any> {
    Status?: number;
    Message: string;
    EvCode?: string;
    EvType?: string;
    data?: T;
    Widget?: T;
    Widgets?: T;
    TimeStamp?: string;
}