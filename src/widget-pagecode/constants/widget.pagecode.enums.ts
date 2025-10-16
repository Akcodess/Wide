export enum WidgetMessage {
  RetrievedSuccessfully = "Widgets found successfully by ApplicationCode and PageCode",
  NoWidgetsFound = "No widgets found for the given ApplicationCode and PageCode",
  FailedToParseUserIds = "Failed to parse UserIds for widget:",
  PageWidgetMappingCreated = "Mapping created successfully",
  PageWidgetMappingUpdated = "Mapping updated successfully",
  PageWidgetMappingCreatedUpdated= "Mapping created/updated successfully."
}

export enum WidgetEvCode {
  GetWidgetByPageCode = 'GetWidgetByPageCode',
    CreatePageCodeWidgetMapping = "CreatePageCodeWidgetMapping"
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