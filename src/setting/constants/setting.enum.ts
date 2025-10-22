export enum WidgetMessage {
    SettingsFetched = "Settings fetched successfully",
    SettingsNotFound = "Settings not found",
    SettingCreated = "Setting created successfully",
    SettingUpdated = "Setting updated successfully",
    SettingDeleted = "Setting deleted successfully",
    ErrorFetchingSettings = "Error fetching settings",
    ErrorCreatingSetting = "Error creating setting",
    ErrorUpdatingSetting = "Error updating setting",
    ErrorDeletingSetting = "Error deleting setting"
}

export enum SettingEvCode {
    GetSettings = "GetSettings",
    CreateSetting = "CreateSetting",
    UpdateSetting = "UpdateSetting",
    DeleteSetting = "DeleteSetting"
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