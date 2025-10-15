export enum WidgetMessage {
  RetrievedSuccessfully = "Widgets found successfully by ApplicationCode and PageCode",
  NoWidgetsFound = "No widgets found for the given ApplicationCode and PageCode",
  FailedToParseUserIds = "Failed to parse UserIds for widget:"
}

export enum WidgetEvCode {
  GetWidgetByPageCode = 'GetWidgetByPageCode',
}

export enum WidgetEvType {
  Success = 'Success',
  Failed = 'Failed',
}

export enum WidgetStatus {
  Ok = 200,
  NotFound = 404,
  BadRequest = 400
}