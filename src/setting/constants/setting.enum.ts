export enum WidgetMessage {
    PageWidgetMappingDeleted = "Settings fetched successfully",
    PageWidgetMappingNotFound = "Settings not found",
    ErrorFetchingSettings = "Error fetching settings"
}

export enum WidgetEvCode {
    GetSettings = "GetSettings"
}

export enum WidgetEvType {
    Success = 'Success',
    Failed = 'Failed',
}

export enum WidgetStatus {
    Ok = 200,
    NotFound = 404,
    BadRequest = 400,
    InternalServerError = 500
}