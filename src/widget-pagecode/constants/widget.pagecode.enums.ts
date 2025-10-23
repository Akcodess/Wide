export enum WidgetMessage {
  RetrievedSuccessfully = "Widgets found successfully by ApplicationCode and PageCode",
  NoWidgetsFound = "No widgets found for the given ApplicationCode and PageCode",
  FailedToParseUserIds = "Failed to parse UserIds for widget:",
  PageWidgetMappingCreated = "Mapping created-updated successfully",
  PageWidgetMappingUpdated = "Mapping updated successfully",
  PageWidgetMappingCreatedUpdated = "Mapping created-updated successfully",
  PageWidgetMappingDeleted = "Mapping deleted successfully",
  PageWidgetMappingNotFound = "No mapping found to delete",
  ErrorDeletingMapping = "Error deleting mapping for widget",
}

export enum WidgetEvCode {
  GetWidgetByPageCode = 'GetWidgetByPageCode',
  CreatePageCodeWidgetMapping = "CreatePageCodeWidgetMapping",
  DeletePageCodeWidgetMapping = "DeletePageCodeWidgetMapping"
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